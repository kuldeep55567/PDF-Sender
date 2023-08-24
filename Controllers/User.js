const express = require("express");
const UserRouter = express.Router()
const jwt = require("jsonwebtoken")
const pdfkit = require("pdfkit");
require("dotenv").config()
const { HistoryModel } = require("../Model/History-Model")
const {verifyToken} = require("../Middleware/Authenticate")
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_KEY);
UserRouter.get('/verify/:token', async (req, res) => {
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        const email = decodedToken.email;
        await HistoryModel.findOneAndUpdate({ email }, { isVerified: true});
        await HistoryModel.findOneAndUpdate({ email }, { $push: { history: new Date().toLocaleString()} });
        res.status(200).json({ Message: "Email verified successfully",Note:"Use this token for further API calls. Valid for 24hr",Token:token });
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
});

UserRouter.post('/auth', async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await HistoryModel.findOne({ email });
        if (existingUser) {
            if (existingUser.isVerified) {
                const rtoken = jwt.sign({ email }, process.env.SECRET, { expiresIn: '24h' });
                await HistoryModel.findOneAndUpdate({ email }, { $push: { history: new Date().toLocaleString()} });
                const mailOptions = {
                    to: email,
                    from: process.env.SEND_GRID_EMAIL,
                    subject: 'Access Token',
                    html: `
                    <h2>This token is valid only for 24hrs</h2>
                    <h3>Token - ${rtoken}</h3>
                    `,
                };
                sgMail.send(mailOptions);

                res.status(200).json({
                    Response: {
                        email: email,
                        token: rtoken
                    }
                });
            } 
        }else {
            const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: '24h' });
            const verificationURL = `http://localhost:4500/verify/${token}`;
            const user = new HistoryModel({
                email
            });
            await user.save();
            
            const mailOptions = {
                to: email,
                from: process.env.SEND_GRID_EMAIL,
                subject: 'Email Verification',
                html: `
                <p>Please Verify Your Email by clicking on the Link Below</p>
                <a href="${verificationURL}">${verificationURL}</a>
                `,
            };
            sgMail.send(mailOptions);
            
            res.status(200).json({
                Response: {
                    email: email,
                    token: token
                }
            });
        }
    } catch (error) {
        res.status(500).json({ mssg: error.message });
    }
});
UserRouter.get("/get-history", verifyToken, async (req, res) => {
    try {
        const email = req.email;
        
        const history = await HistoryModel.aggregate([
            { $match: { email: email } },
            { $unwind: "$history" },
            {
                $project: {
                    _id: 0,
                    "sent-to": "$email",
                    date_created:"$history"
                }
            }
        ]);

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
UserRouter.post("/send-report", verifyToken,async (req, res) => {
    try {
        const { email} = req.body;
        const doc = new pdfkit();
        doc.fontSize(14);
        doc.text("Report Generated", { align: "center" });
        doc.moveDown();
        doc.text(`Date and Time: ${new Date().toLocaleString()}`, { align: "center" });
        doc.text(`User's email: ${email}`, { align: "center" });
        const pdfBuffer = await new Promise(resolve => {
            const buffers = [];
            doc.on("data", buffer => buffers.push(buffer));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.end();
        });
        const pdfBase64 = pdfBuffer.toString("base64");
        const msg = {
            to: email,
            from: process.env.SEND_GRID_EMAIL,
            subject: "Report",
            text: "Report attached",
            attachments: [
                {
                    filename: "report.pdf",
                    content: pdfBase64,
                    type:"application/pdf"
                },
            ],
        };
        await sgMail.send(msg);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = { UserRouter }
import authController from './modules/auth/auth.controller.js'
import connectDB from './DB/connection.js'
import userController from './modules/user/user.controller.js'


const bootstrap = (app , express) => {
    app.use(express.json())

    app.get("/" , (req , res , next) => {
        return res.status(200).json({message : "welcome in node.js project"})
    })

    app.use("/auth" , authController)
    app.use("/user" , userController)

    app.all("*" , (req,res,next) => {
        return res.status(404).json({message : "In-valid routing"})
    })

    connectDB()
}

export default bootstrap
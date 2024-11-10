import mongooose from "mongoose"
const conversationSchema = new mongooose.Schema({
    message:[{
        type: mongooose.Schema.Types.ObjectId,
        ref: "Message"
    }],
    participants: [{
        type: mongooose.Schema.Types.ObjectId,
        ref: "User"
    }]
})
export const Conversation = mongooose.model("Conversation", conversationSchema)
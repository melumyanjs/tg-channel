import { getObjectId } from "../../handlers/mongomanager.js"
import { db } from "../server.js"

class ChannelController{ 
    async view(req, res, next){
        const idChannel = req.params.channel
        const oId = getObjectId(idChannel)

        const channelData = await db.aggregate('channels', [{
            $lookup: { 
                from: "channelStatistics", 
                localField: "_id", 
                foreignField: "channelId", 
                as: "stat"
            }},
            {
                $match: {
                    _id: oId,
                  },
              },
        ])
        const channelDataClient = {
            data: {
                ...channelData[0],
                isPrivate: channelData[0]?.stat[0].isPrivate,
                lang: channelData[0]?.stat[0].lang,
                categories: channelData[0]?.stat[0].categories,
            },
            stat: channelData[0]?.stat[0].statistics,
        }
        delete channelDataClient.data.stat

        return res.render("channelstat", channelDataClient)
    }
}


export default new ChannelController()
import { db } from "../server.js";

class ApiController {
    async getDataChannel(req, res, next){
        const limit = Number.parseInt(req.query.limit);
        const skip = (Number.parseInt(req.query.page)-1) * limit;
    
        const channels = await db.aggregate('channels', [{
            $lookup: { 
                from: "channelStatistics", 
                localField: "_id", 
                foreignField: "channelId", 
                as: "stat"
            }
        },
        // {
        //     $limit: limit
        // }, 
        // {   
        //     $skip: skip
        // }
        ])

        const channelsClient = []
        for(let item of channels){
            channelsClient.push({
                _id: item._id,
                namechanel: item.namechanel,
                nameru: item.nameru,
                category: item.category,
                urlstat: item.urlstat,
            })
        }

        return res.json(channelsClient)   
    }
}


export default new ApiController()
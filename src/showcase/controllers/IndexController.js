class IndexController {
    view(req, res, next){
        return res.render("index")
    }
}

export default new IndexController() 
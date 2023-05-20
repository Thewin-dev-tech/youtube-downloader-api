const express = require("express");
const yt = require("yt-converter");
const fs = require("fs/promises");
const path = require("path");

const app = express();
app.use(require("cors")());

const dir = `/files/`;

app.get("/",(request,response,next)=>{
    response.status(200).send("THIS IS YOUTUBE DOWNLOADER...")
});

app.get("/mp3/:url",async (request,response,next)=>{
    try {
        let url = request.params.url;

        if(!url) throw new Error("invalid_url");

        console.log(url);

        //---- clear files ----
        let files = await fs.readdir(`.`+dir);
        for(file of files){
            await fs.unlink(`.`+dir+file);
        }
        //--------------------
        yt.convertAudio({
            url: url,
            itag: 140,
            directoryDownload: `.`+dir,
            title: "Your title here"
        },()=>{
            console.log(`กำลังโหลด....`);
        },async (file)=>{

            console.log("เสร็จสิ้น");

            files = await fs.readdir(`.`+dir);
            const targetPath = dir+files[0];
            response.download(path.join(__dirname + targetPath));
       
            return ;
        })

    } catch (error) {
        console.error(error.stack);
        response.status(500).json({status :false ,message : `error`});
    }
})

app.listen(3000,()=>{
    console.log("YOUTUBE DOWNLOADER HAS RUNNING...")
})
const fs = require('fs');
const fsPromise = fs.promises;
const path = require('path');
const dirName = process.argv[2];



function logger (file){
  console.log(`${file} is moved to `);
}

function moveFile (file,filePath,todir) {


  const readStream = fs.createReadStream(filePath)
  const writeStream = fs.createWriteStream(`./${todir}/${file}`)
  const piping = readStream.pipe(writeStream)
  piping.on('finish', () => {
    fsPromise.rm(filePath)
    .catch(
      console.error
    )
    
    logger(file);  
  }) 
}

function classfyFile (files) {
  files.forEach((file)=>{

    const extentionName = path.extname(file);
    const filePath = `./${dirName}/${file}`
    const reEdited = /IMG_E[0-9]*.jpg/;
    const reNumber = /[0-9]+/;
    const reOrigin = /IMG_[0-9]*.jpg/; 
    




    if (extentionName === '.mov' || extentionName === '.mp4'){
      const toDir = 'video'
      moveFile(file,filePath,toDir)
    }
    else if (extentionName === '.png' || extentionName === '.aae'){
      const toDir = 'captured';
      moveFile(file,filePath,toDir);
    }
   // when file is IMG_XXXX.jpg and their number are same, move IMG_XXXX.jpg 
    else if (reOrigin.test(file)){
      const originImgNumber = reNumber.exec(file)[0];
      let isDuplicated = false;
      files.forEach((file)=>{
        if (reEdited.test(file)){
          const editedImgNumber =  reNumber.exec(file)[0]
          if (originImgNumber === editedImgNumber){
            isDuplicated = true;
          }
        }        
      })
      
      if (isDuplicated){
        const toDir = 'duplicated'
        moveFile(file,filePath,toDir)  
      }

  }
}) 
}


fsPromise.mkdir('video',{ recursive: true }) //
  .catch(console.error);


fsPromise.mkdir('captured',{ recursive: true }) //
.catch(console.error);

fsPromise.mkdir('duplicated',{ recursive: true }) //
  .catch(console.error);

// read all in dir
fsPromise.readdir(`./${dirName}/`) 
  .then(classfyFile)
  .catch(console.error);


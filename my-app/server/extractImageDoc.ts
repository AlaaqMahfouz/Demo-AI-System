// utils/extractImages.ts

import * as mammoth from 'mammoth';


export default async function extarctDocImages(filePath: string) {

    let Buffers:Buffer[]= []

    var options = {  // configure options for mammoth
        
        convertImage: mammoth.images.imgElement(function(image) {
            return image.read("base64").then(async function(imageBuffer) {  // get images as base64 buffers

                const ImageBufferObject = Buffer.from(imageBuffer, 'base64'); // convert base64 to buffer object

                Buffers.push(ImageBufferObject); // save buffers to array
                return {
                    src: "data:" + image.contentType + ";base64," + imageBuffer
                };
            });
        })
    };

    await mammoth.convertToHtml({path: filePath}, options);


    return Buffers;
}


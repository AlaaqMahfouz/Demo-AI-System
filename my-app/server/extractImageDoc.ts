// utils/extractImages.ts

import * as mammoth from 'mammoth';
import * as fs from 'fs-extra';
import { file } from 'googleapis/build/src/apis/file';
// import * as puppeteer from 'puppeteer';
import { ImagesResult } from 'groupdocs-parser-cloud';

export default async function extarctDocImages(filePath: string) {

    let Buffers:Buffer[]= []

    var options = {
        
        convertImage: mammoth.images.imgElement(function(image) {
            return image.read("base64").then(async function(imageBuffer) {

                const ImageBufferObject = Buffer.from(imageBuffer, 'base64');

                Buffers.push(ImageBufferObject);
                return {
                    src: "data:" + image.contentType + ";base64," + imageBuffer
                };
            });
        })
    };

    await mammoth.convertToHtml({path: filePath}, options);

    

    // const images: Image[] = Images.value.images.map((image: any) => ({
    //     src: image.src
    // }));



    return Buffers;
}


import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import 'dotenv/config'
import { MinioService } from 'nestjs-minio-client';

@Injectable()
export class MinioClientService {

  constructor( private readonly minio: MinioService) {}

  private readonly bucketName = process.env.MINIO_BUCKET;

  public get client() { return this.minio.client }

  public async upload( file: BufferedFile,  bucketName: string = this.bucketName ) {
  
    // if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png')|| file.mimetype.includes('csv'))) {

    //   throw new HttpException( 'File type not supported',  HttpStatus.BAD_REQUEST ); 
    // }

    const timestamp = Date.now().toString();

    const hashedFileName = crypto.createHash('md5').update(timestamp).digest('hex');
    const extension = file.originalname.substring(file.originalname.lastIndexOf('.'),file.originalname.length)
    const metaData = {'Content-Type': file.mimetype}

    // We need to append the extension at the end otherwise Minio will save it as a generic file
    const fileName = hashedFileName + extension;

    this.client.putObject(
      bucketName,
      fileName,
      file.buffer,
      file.size,
      metaData,
      function (err, res) {
        if (err) {
          throw new HttpException( 'Error uploading file', HttpStatus.BAD_REQUEST )
        }
      }
    )

    return {
      url: `${process.env.SSL == 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`
    }
  }

  public async csvUpload( filePath:string,bucketName: string = this.bucketName ) {
  
    // if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png')|| file.mimetype.includes('csv'))) {

    //   throw new HttpException( 'File type not supported',  HttpStatus.BAD_REQUEST ); 
    // }

    const metaData = {
      'Content-Type': 'application/octet-stream',
      'X-Amz-Meta-Testing': 1234,
      example: 5678,
    };
    const date=Date.now()
    // Using fPutObject API upload your file to the bucket europetrip.
    this.client.fPutObject(
      bucketName,
      `${date}.csv`,
      filePath,
      metaData,
      function(err, etag) {
        if (err) {
          return console.log(err);
        }
        console.log('File uploaded successfully.');
        console.log(date)
        console.log({url: `${process.env.SSL == 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT2}:${process.env.MINIO_PORT}/${bucketName}/${date}.csv`})
         
        
      },
    );

    return {url: `${process.env.SSL == 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT2}:${process.env.MINIO_PORT}/${bucketName}/${date}.csv`}
  }
  

  async delete(objetName: string, bucketName: string = this.bucketName) {
    this.client.removeObject(bucketName, objetName, function (err) {
      if (err)
        {
            console.log('Unable to remove object', err)
            throw new HttpException( 'An error occured when deleting!', HttpStatus.BAD_REQUEST  );
        }

        else {

            console.log('Removed the object')
            return "Removed the object"
        }

    })
  }

}

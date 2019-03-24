# Poor Man's Rekognition (POC for GSoC'19)
A free and open source alternative to Amazon Rekognition       
Currently uses [huan's node-facenet](https://github.com/huan/node-facenet), a Nodejs wrapper for the tensorflow implementation of [Facenet by davidsandberg](https://github.com/davidsandberg/facenet).
My main focus is to make a REST API similar to Amazon Rekognition keeping the same request/response syntax. The server is written in TypeScript using ExpressJS.
***
[Check out LIVE demo](http://35.244.40.240:8080)
### Implemented APIs
- DetectFaces
- CompareFaces
---
### Setup
- Ubuntu 18.04, Nodejs 10.15, Python 3.6
- 4-6GB RAM is needed by Python Facenet model. 
- Install packages: `python3-dev python3-pip python3-venv libsm6 make libxrender-dev`
- Deactivate any python environment (important if your are using conda)
- cd to cloned repository
- `$ npm install`
- Start server on any port (default 3000): `$ npm start`
---
## API Reference

**Request header**      
    `"Content-Type": "application/json"`      
All request/response formats are same as Amazon Rekognition formats
### 1. DetectFaces  
A. Using GET    
`GET /api/face-detection/from-url?imageUrl=http://example.com/image.jpg`     
**Response format**
```
    {
        "FaceDetails": [ 
            { 
                "BoundingBox": { 
                    "Height": number,
                    "Left": number,
                    "Top": number,
                    "Width": number
                },
                "Confidence": number
            }
        ],
        "OrientationCorrection": "string"
    }
```
Note: The BoundingBox values are in ratios just like [Amazon Rekognition BoundingBox](https://docs.aws.amazon.com/rekognition/latest/dg/API_BoundingBox.html) type

    The top and left values returned are ratios of the overall image size. For example, if the input image is 700x200 pixels, and the top-left coordinate of the bounding box is 350x50 pixels, the API returns a left value of 0.5 (350/700) and a top value of 0.25 (50/200).
B. Using POST   
`POST /api/face-detection/from-blob`            
**Request body format**     
```
    {
        "Image": { 
            "Bytes": `Image as base64 DataUrl string`,
        }
    }
```
**Response format**     
   Same as GET      


### 2. CompareFaces
A. Using GET    
`GET /api/compare-faces/from-url?sourceImage=http://example.com/image1.jpg&targetImage=http://example.com/image2.jpg&similarityThreshold=60`      

**Response format**     
```   
    {
        "FaceMatches": [ 
            { 
                "Face": { 
                    "BoundingBox": { 
                    "Height": number,
                    "Left": number,
                    "Top": number,
                    "Width": number
                    },
                    "Confidence": number,
                },
                "Similarity": number
            }
        ],
        "SourceImageFace": { 
            "BoundingBox": { 
                "Height": number,
                "Left": number,
                "Top": number,
                "Width": number
            },
            "Confidence": number
        },
        "SourceImageOrientationCorrection": "string",
        "TargetImageOrientationCorrection": "string",
        "UnmatchedFaces": [ 
            { 
                "BoundingBox": { 
                    "Height": number,
                    "Left": number,
                    "Top": number,
                    "Width": number
                },
                "Confidence": number
            }
        ]
    }    
```
B. Using POST   
`POST /api/compare-faces/from-blob`   
**Request body**        
```
    {
        "SimilarityThreshold": number,
        "SourceImage": { 
            "Bytes": blob
        },
        "TargetImage": { 
            "Bytes": blob
        }
    }
```

### Credits
These projects saved me a lot of time. I learn't TypeScript after reading huan's beautifully organised code.
- [huan/node-facenet](https://github.com/huan/node-facenet)
- [davidsandberg/facenet](https://github.com/davidsandberg/facenet)

### GSoC
This project is my Proof of Concept for [CCExtractor](https://www.ccextractor.org/public:gsoc:ideas_page_for_summer_of_code_2019)'s 'Poor Man's Rekognition' problem statement. Code reviews will be highly appreciated.

## License
Licensed under GPL-3.0
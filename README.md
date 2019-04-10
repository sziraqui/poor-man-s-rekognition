# Poor Man's Rekognition (POC for GSoC'19)
A free and open source alternative to Amazon Rekognition       
This branch uses [face-api.js](https://github.com/justadudewhohacks/face-api.js), with light weight tfjs implementations [Facenet](https://github.com/davidsandberg/facenet).
I have demonstrated Video Annotation feature and a REST API for PMR

***
[Check out LIVE demo](http://35.244.40.240:8080)

### Implemented features
- Face detection (via face-api.js)
- Face recognition (via face-api.js)
- Video annotation (opencv4nodejs and face-api.js)
---
### Implemented APIs
- DetectFaces
- CompareFaces
---
### Setup
- Ubuntu 18.04, Nodejs 10.x
- Install [OpenCV 3.x required packages](https://docs.opencv.org/3.4.6/d7/d9f/tutorial_linux_install.html)
- `git clone https://github.com/sziraqui/poor-man-s-rekognition.git pmr`
- `cd pmr`
- `$ npm install`
- Start server on any port (default 3000): `$ npm start`

### Run video annotation example
- Ensure you have ts-node installed `npm i -g ts-node-dev`
- Now run the example on sample input:      
`ts-node manual-tests/video-recog.ts -r samples/karan_johar.jpg samples/Tiger-Shroff-3.jpg samples/tara-sutaria.jpg samples/ananya_pandey.jpg -n karan tiger tara ananya -t samples/kofee-with-karan-trim.mp4 -s 80 -d 0.9 -v true`

---
## REST API Reference

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

### Main libraries used
- [face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs)

### GSoC
This project is my Proof of Concept for [CCExtractor](https://www.ccextractor.org/public:gsoc:ideas_page_for_summer_of_code_2019)'s 'Poor Man's Rekognition' problem statement. Code reviews will be highly appreciated.

## License
Licensed under GPL-3.0
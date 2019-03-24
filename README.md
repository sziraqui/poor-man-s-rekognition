# Poor Man's Rekognition
A free and open source alternative to Amazon Rekognition    

### Implemented APIs
- DetectFaces
- CompareFaces

### Setup
- 4-6GB RAM is needed by python Facenet model. 
- Install packages: `python3-dev python3-pip python3-venv libsm6 make`
- Deactivate any python environment (important if your are using conda)
- cd to cloned repository
- `$ npm install`
- Start server on any port 3000: `$ npm start`

## API Reference

**Request header**      
    `"Content-Type": "application/json"`      
All request/response formats are same as Amazon Rekognition formats
### 1. DetectFaces  
A. Using GET    
`GET /api/face-detection/from-url?imageUrl=http://example.comimage.jpg`     
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
`GET /api/compare-faces/from-url?sourceImage=http://example.comimage1.jpg&targetImage=http://example.com/image2.jpgsimilarityThreshold=60`      

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
- huan/node-facenet
- davidsandberg/facenet

### GSoC
This project is the POC for CCExtractor's 'Poor Man's Rekognition' problem statement.
from io import BytesIO

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from rembg import remove

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow your Next.js app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/remove-background")
async def remove_background(file: UploadFile = File(...)):
    contents = await file.read()
    input_image = BytesIO(contents)
    output_image = BytesIO()

    input_image.seek(0)
    output_image.seek(0)

    result = remove(input_image.read())
    output_image.write(result)
    output_image.seek(0)

    return StreamingResponse(output_image, media_type="image/png")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

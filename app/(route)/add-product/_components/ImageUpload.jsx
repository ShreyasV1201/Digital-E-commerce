"use client"

import { useState } from "react";
import Image from "next/image";


function ImageUpload({ onImageSelect }) {
    const [image, setImage] = useState();
    const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    onImageSelect?.(file);   // send FILE not event

    const reader = new FileReader();

    reader.onloadend = () => {
        setImage(reader.result);
    };

    reader.readAsDataURL(file);
};

    return (
        <div>
            <h2>Upload Product Image</h2>
            <input type="file" id="imageUpload" name="image" className="hidden" onChange={handleFileChange} />
            <label htmlFor="imageUpload">
                <div className="p-10 flex justify-center items-center cursor-pointer border-dashed border-2 border-black bg-slate-600">
                    <Image src={'/user.png'} alt="image" width={70} height={70} />
                    {image ? (
                        <Image src={image} alt="Uploaded" width={300} height={300} className="object-contain h-[200px]" />
                    ) : (
                        <Image src="/sample.png" alt="Sample" width={70} height={70} className="opacity-35"/>
                    )}

                </div>
            </label>
        </div>
    )
}

export default ImageUpload
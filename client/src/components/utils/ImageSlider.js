import React from 'react'
import { Carousel } from 'antd';

function ImageSlider(props) {
    return (
        <div>
            <Carousel autoplay >
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img style={{ width: '100%', height:'300px', maxHeight: '300px' }}
                            src={`http://localhost:5000/${image}`}
                            alt={"image"} />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider

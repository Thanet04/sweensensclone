'use client'

import Slider from "react-slick";
import Image from "next/image";
import banner from "../image/banner2Fsw-banner.webp";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function BannerSlick() {
    const slides = [banner];

    const settings = {
        dots: true, // แสดง pagination
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        appendDots: (dots: React.ReactNode) => (
            <div style={{ bottom: "-15px" }}>
                <ul style={{ margin: "0px", display: "flex", justifyContent: "center" }}>
                    {dots}
                </ul>
            </div>
        ),
        customPaging: (i: number) => (
            <div
                style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "red",
                    margin: "10px 2px",
                }}
            />
        ),
    };

return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 relative">
        <Slider {...settings}>
            {slides.map((slide, idx) => (
                <div
                    key={idx}
                    className="relative w-full h-[200px] sm:h-[250px] md:h-[300px]"
                >
                    <Image
                        src={slide}
                        alt={`Banner ${idx}`}
                        className="object-cover w-full h-full rounded-2xl"
                        fill
                    />
                </div>
            ))}
        </Slider>
    </div>
);
}

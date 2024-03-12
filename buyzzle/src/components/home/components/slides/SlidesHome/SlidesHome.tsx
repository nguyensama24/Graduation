// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./styles.css";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { BannerHomeModel } from "../../../../../model/BannerHomeModel";
import { bannerhomeController } from "../../../../../controllers/BannerHomeController";
import { useEffect, useState } from "react";

export default function SlidesHome() {
  const [banner, setBanner] = useState<BannerHomeModel[]>([]);

  const getAllBaner = async () => {
    await bannerhomeController.getAll().then((res: any) => {
      setBanner(res);
    });
  };

  useEffect(() => {
    getAllBaner();
  }, []);
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper max-[1023px]:hidden"
      >
        {banner?.map((items) => {
          return (
            <>
              <SwiperSlide className="max-[769px]:max-w-[648px] max-h-[400px] flex items-center justify-center">
                <a href={`${items.linkgoogle}`} style={{ height: "100%" }}>
                  <img
                    src={items.image}
                    alt=""
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </a>
              </SwiperSlide>
            </>
          );
        })}
        {/* <SwiperSlide className='max-[769px]:max-w-[648px]'>
          <img className='object-cover' src='https://lzd-img-global.slatic.net/g/icms/images/ims-web/36e0d44b-5402-402e-94a7-0591142bba62.jpg_2200x2200q90.jpg_.webp' alt="" />
        </SwiperSlide>

        <SwiperSlide className='max-[769px]:max-w-[648px]'>
          <img className='object-cover' src='https://lzd-img-global.slatic.net/g/icms/images/ims-web/ae57556d-c557-4bc9-93ad-7f7ee3ca9ad8.png_2200x2200q90.jpg_.webp' alt="" />
        </SwiperSlide>

        <SwiperSlide className='max-[769px]:max-w-[648px]'>
          <img src='https://icms-image.slatic.net/images/ims-web/e6360b2f-4a80-42da-9118-016a658cb63b.jpg' alt="" />
        </SwiperSlide> */}
      </Swiper>
    </>
  );
}

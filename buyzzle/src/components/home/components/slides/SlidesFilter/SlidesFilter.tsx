// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./stylesFilter.css";

// import required modules
import { useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { bannerController } from "../../../../../controllers/BannerController";
import { BannerModel } from "../../../../../model/BannerModel";

export default function SlidesFilter() {
  const [banner, setBanner] = useState<BannerModel[]>([]);

  const getAllBaner = async () => {
    await bannerController.getAll().then((res: any) => {
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
        className="mySwiper"
      >
        {banner?.map((items) => {
          return (
            <>
              <SwiperSlide
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "400px",
                }}
              >
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
      </Swiper>
    </>
  );
}
{
}

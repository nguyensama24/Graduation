
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './styles.css';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export default function Slides() {
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
        <SwiperSlide>
          <img className='object-cover' src='https://lzd-img-global.slatic.net/g/icms/images/ims-web/36e0d44b-5402-402e-94a7-0591142bba62.jpg_2200x2200q90.jpg_.webp' alt="" />

        </SwiperSlide>
        <SwiperSlide>
          <img src='https://lzd-img-global.slatic.net/g/icms/images/ims-web/ae57556d-c557-4bc9-93ad-7f7ee3ca9ad8.png_2200x2200q90.jpg_.webp' alt="" />

        </SwiperSlide>
        <SwiperSlide>
          <img src='https://icms-image.slatic.net/images/ims-web/e6360b2f-4a80-42da-9118-016a658cb63b.jpg' alt="" />

        </SwiperSlide>
      </Swiper>
    </>
  );
}

const productSwiper = new Swiper(".new-product-swiper", {
            slidesPerView: "auto",
            spaceBetween: 4,
            slidesOffsetBefore: 120,
            slidesOffsetAfter: 120,
            grabCursor: true,
            observer: true,
            observeParents: true,
            scrollbar: {
                el: ".new-product-scrollbar",
                draggable: true,
                snapOnRelease: false
            },
            breakpoints: {
                0: {
                    centeredSlides: false,
                    spaceBetween: 6,
                    slidesOffsetBefore: 10,
                    slidesOffsetAfter: 10
                },
                481: {
                    centeredSlides: false,
                    spaceBetween: 8,
                    slidesOffsetBefore: 12,
                    slidesOffsetAfter: 12
                },
                790: {
                    centeredSlides: false,
                    spaceBetween: 4,
                    slidesOffsetBefore: 40,
                    slidesOffsetAfter: 40
                },
                1281: {
                    centeredSlides: false,
                    spaceBetween: 4,
                    slidesOffsetBefore: 120,
                    slidesOffsetAfter: 120
                }
            }
        });

        window.addEventListener("resize", () => {
            productSwiper.update();
        });
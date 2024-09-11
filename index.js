import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/dist/SplitText"; // Импорт SplitText
import useIsMobile from "../../hooks/useIsMobile";
import styles from "./styles.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

const slidesData = [
  {
    text: { title: "Kastanienallee, Berlin, ", date: "11.2017-01.2019", index: "lp1-4" },
    images: ["/images/main1-1.jpg", "/images/main1-2.jpg", "/images/main1-3.jpg", "/images/main1-4.jpg"],
  },
  {
    text: { title: "Effel, Paris, ", date: "11.2015-03.2018", index: "" },
    images: ["/images/main2-1.jpg", "/images/main2-2.jpg", "/images/main2-3.jpg"],
  },
  {
    text: { title: "The Grand Hotel, New-York, ", date: "11.2019-04.2023", index: "" },
    images: ["/images/main3-1.jpg", "/images/main3-2.jpg", "/images/main3-1.jpg"],
  },
];

const MainSliderMob = () => {
  const [currentText, setCurrentText] = useState(slidesData[0]?.text || "");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const sliderRef = useRef(null);
  const textOverlayRef = useRef(null);
  const titleRef = useRef(null);
  const dateRef = useRef(null);
  const indexRef = useRef(null);
  const isMobile = useIsMobile(768);

  const flipTextAnimation = (element) => {
    const split = new SplitText(element, { type: "chars" });

    gsap.fromTo(
      split.chars,
      { rotationX: 540, opacity: 0 },
      {
        rotationX: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.inOut",
        onComplete: () => split.revert(),
      }
    );
  };

  useEffect(() => {
    const createTriggers = () => {
      const slideWrappers = gsap.utils.toArray(`.${styles.mainSliderMob__slide}`);
      const textOverlay = textOverlayRef.current;

      slideWrappers.forEach((slide, index) => {
        ScrollTrigger.create({
          trigger: slide,
          // markers: true,
          start: () => `top ${textOverlay.getBoundingClientRect().bottom}px`,
          end: () => `bottom ${textOverlay.getBoundingClientRect().top}px`,
          onEnter: () => {
            const groupIndex = slide.dataset.group;
            setCurrentText(slidesData[groupIndex].text);
          },
          onLeaveBack: () => {
            const groupIndex = slide.dataset.group;
            if (groupIndex > 0) {
              setCurrentText(slidesData[groupIndex - 1].text);
            }
          },
        });
      });

      // Обновление с небольшой задержкой для точного расчета
      setTimeout(() => ScrollTrigger.refresh(), 50);
    };

    const initTriggers = () => {
      // Добавляем задержку перед инициализацией триггеров
      setTimeout(() => {
        // Проверяем, загружены ли все изображения
        const images = Array.from(document.images);
        const allImagesLoaded = images.every((img) => img.complete);

        if (allImagesLoaded) {
          createTriggers();
        } else {
          window.addEventListener("load", createTriggers);
        }
      }, 200); // Задержка в 200 миллисекунд перед инициализацией триггеров
    };

    // Инициализация триггеров
    initTriggers();

    // Очистка триггеров при размонтировании
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!isFirstLoad) {
        if (titleRef.current) flipTextAnimation(titleRef.current, currentText.title);
        if (dateRef.current) flipTextAnimation(dateRef.current, currentText.date);
        if (indexRef.current) flipTextAnimation(indexRef.current, currentText.index);
      } else {
        setIsFirstLoad(false);
      }
    }, 0); // Задержка в 0 миллисекунд
  }, [currentText, isFirstLoad]);

  return (
    <div className={styles.mainSliderMob}>
      <div className={styles.mainSliderMob__wrapper}>
        <div ref={textOverlayRef} className={styles.mainSliderMob__wrapper__glassText}>
          <div className={styles.mainSliderMob__wrapper__glassText__textOverlay}>
            <div className={styles.mainSliderMob__wrapper__glassText__textOverlay__wrapper}>
              <div className={styles.mainSliderMob__wrapper__glassText__textOverlay__info}>
                <p ref={titleRef}>{currentText.title}</p>
                <span ref={dateRef}>{currentText.date}</span>
              </div>
              <div className={styles.mainSliderMob__wrapper__glassText__textOverlay__index}>
                <p ref={indexRef}>{currentText.index}</p>
              </div>
            </div>
          </div>
        </div>
        <div ref={sliderRef} className={styles.mainSliderMob__slider}>
          {slidesData.map((slide, index) => (
            <div className={styles.mainSliderMob__slide} key={index} data-group={index}>
              {slide.images.map((image, imgIndex) => (
                <div className={styles.mainSliderMob__slide__wrapper} key={imgIndex}>
                  <img className={styles.mainSliderMob__slide__img} src={image} alt={`image ${imgIndex}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainSliderMob;

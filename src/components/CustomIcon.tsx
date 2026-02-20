export default function CustomIcon() {
  return (
    <div className="w-[52px] h-[52px] flex-shrink-0" role="img" aria-label="rePROMPTer logo">
      <svg viewBox="0 0 1024 1024" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient
            id="iconGrad"
            x1="110"
            y1="180"
            x2="860"
            y2="890"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF4D5A" />
            <stop offset="1" stopColor="#8B0000" />
          </linearGradient>
        </defs>

        {/* Pencil (outline with hollow center) */}
        <path
          fill="url(#iconGrad)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="
            M 270 660
            L 620 310
            Q 650 280 690 320
            L 780 410
            Q 820 450 790 480
            L 440 830
            Q 420 850 395 842
            L 260 800
            Q 230 790 240 760
            L 278 685
            Q 285 672 270 660
            Z
            M 330 675
            L 615 390
            Q 630 375 645 390
            L 700 445
            Q 715 460 700 475
            L 415 760
            Q 405 770 392 766
            L 315 742
            Q 302 738 308 726
            L 336 690
            Q 344 680 330 675
            Z
          "
        />

        {/* Pencil tip detail */}
        <path
          fill="url(#iconGrad)"
          fillRule="evenodd"
          clipRule="evenodd"
          d="
            M 308 726
            L 362 705
            L 338 750
            Q 334 758 326 756
            L 310 751
            Q 302 748 304 740
            L 308 726
            Z
            M 326 735
            L 346 727
            L 337 744
            L 326 741
            L 326 735
            Z
          "
        />

        {/* Dash / underline */}
        <rect x="390" y="820" width="470" height="70" rx="35" fill="url(#iconGrad)" />

        {/* Large sparkle (left) */}
        <path
          fill="url(#iconGrad)"
          d="
            M 260 250
            L 310 350
            L 410 400
            L 310 450
            L 260 550
            L 210 450
            L 110 400
            L 210 350
            Z
          "
        />

        {/* Small sparkle (top right) */}
        <path
          fill="url(#iconGrad)"
          d="
            M 740 180
            L 770 240
            L 830 270
            L 770 300
            L 740 360
            L 710 300
            L 650 270
            L 710 240
            Z
          "
        />

        {/* Small sparkle (bottom right) */}
        <path
          fill="url(#iconGrad)"
          d="
            M 720 520
            L 750 580
            L 810 610
            L 750 640
            L 720 700
            L 690 640
            L 630 610
            L 690 580
            Z
          "
        />
      </svg>
    </div>
  );
}

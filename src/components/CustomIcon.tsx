export default function CustomIcon() {
  return (
    <div className="w-[52px] h-[52px] flex-shrink-0" role="img" aria-label="rePROMPTer logo">
      <svg viewBox="0 0 1024 1024" fill="none" className="w-full h-full" aria-hidden="true">
        <g stroke="#8A8A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Pencil body */}
          <path d="M 286 812 L 276 809 L 264 800 L 258 790 L 257 778 L 270 707 L 310 565 L 331 509 L 703 292 L 733 280 L 756 280 L 775 287 L 798 306 L 829 339 L 837 359 L 837 381 L 828 402 L 490 764 L 447 789 L 299 827 L 286 825 Z" />
          {/* Large sparkle (left) */}
          <path d="M 238 350 L 324 283 L 411 347 L 335 391 L 313 477 L 282 394 Z" />
          {/* Small sparkle (top right) */}
          <path d="M 682 252 L 724 219 L 767 251 L 729 273 L 717 315 L 702 278 Z" />
          {/* Small sparkle (bottom right) */}
          <path d="M 679 560 L 722 529 L 764 561 L 727 581 L 713 625 L 701 587 Z" />
          {/* Horizontal bar / underline */}
          <path d="M 411 730 L 431 702 L 769 702 L 795 714 L 804 727 L 803 740 L 794 751 L 769 761 L 423 761 Z" />
          {/* Diagonal slash */}
          <path d="M 400 613 L 368 643 L 623 865 L 652 836 Z" />
          {/* Pencil tip detail */}
          <path d="M 293 654 L 283 666 L 305 701 L 347 721 L 377 713 L 389 699 L 334 649 Z" />
        </g>
      </svg>
    </div>
  );
}

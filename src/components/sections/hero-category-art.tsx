type HeroCategoryKind = "birthday" | "gift" | "baby" | "led";

const commonProps = {
  viewBox: "0 0 168 104",
  className: "h-[5.75rem] w-full max-w-[10.5rem] sm:h-[6.25rem]",
  role: "presentation" as const,
  "aria-hidden": true as const,
  focusable: false as const,
};

function BirthdayArtwork() {
  return (
    <svg {...commonProps}>
      {/* Compact cake, party hat, glasses and a light scattering of confetti. */}
      <ellipse cx="85" cy="96" rx="64" ry="6" fill="#eab6c8" opacity=".24" />
      <path d="M19 74 36 18l18 56Z" fill="#e978a5" stroke="#bc5078" strokeWidth="1.5" />
      <path d="m25 53 23 0M29 41h15M33 29h7" stroke="#fff2bd" strokeWidth="4" />
      <circle cx="36" cy="16" r="6" fill="#e7b39a" />
      <path d="M19 74q18 8 35 0" fill="none" stroke="#c05b82" strokeWidth="4" strokeLinecap="round" />
      <rect x="57" y="63" width="58" height="26" rx="7" fill="#f6b7c9" stroke="#ce7290" strokeWidth="1.4" />
      <path d="M57 66q8-9 16 0t16 0t17 0t9 0v7q-8 6-14 0t-14 0t-15 0t-15 0Z" fill="#fff8f1" />
      <rect x="62" y="77" width="48" height="4" rx="2" fill="#df84a6" opacity=".7" />
      <path d="M83 60V46M96 60V49" stroke="#bc6483" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M83 43q-6 6 0 9 6-3 0-9ZM96 46q-5 5 0 8 5-3 0-8Z" fill="#f2c06a" />
      <path d="M115 43q3-8 11-6 7-1 9 6l-4 9q-4 5-10 0Z" fill="#a85d81" opacity=".92" />
      <path d="M130 43q3-8 11-6 7-1 9 6l-4 9q-4 5-10 0Z" fill="#a85d81" opacity=".92" />
      <path d="M134 42h-4M114 40l-7-5" stroke="#a85d81" strokeWidth="3" strokeLinecap="round" />
      <circle cx="69" cy="23" r="3" fill="#d03d72" />
      <rect x="113" y="17" width="6" height="3" rx="1" fill="#e7b39a" transform="rotate(26 116 18)" />
      <path d="m142 20 5 6-6 3M150 66l-5 3M62 32l4 4" fill="none" stroke="#dca15f" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function GiftArtwork() {
  return (
    <svg {...commonProps}>
      <ellipse cx="84" cy="95" rx="62" ry="6" fill="#dfb5c4" opacity=".26" />
      <rect x="29" y="47" width="57" height="43" rx="7" fill="#f3b6ca" stroke="#ce7999" strokeWidth="1.6" />
      <rect x="25" y="40" width="64" height="14" rx="4" fill="#ef9cb8" />
      <path d="M51 42v47" stroke="#fff5e3" strokeWidth="9" />
      <path d="M55 41c-15-2-19-13-12-17 7-4 14 5 15 16 1-12 12-19 18-13 6 8-7 15-21 14Z" fill="#fff2df" stroke="#d49c75" strokeWidth="1.4" />
      <rect x="86" y="57" width="54" height="33" rx="6" fill="#e9d7c9" stroke="#bb987c" strokeWidth="1.6" />
      <rect x="82" y="50" width="62" height="14" rx="4" fill="#d8b69b" />
      <path d="M113 51v38" stroke="#fff9ed" strokeWidth="8" />
      <path d="M113 51c-15-2-20-10-15-15 6-6 15 2 17 14 0-12 10-21 17-15 8 7-5 17-19 16Z" fill="#fff9ed" stroke="#c29b7d" strokeWidth="1.3" />
      <path d="m142 25 2-7 2 7 7 2-7 2-2 7-2-7-7-2Z" fill="#edbb71" />
      <circle cx="21" cy="27" r="3" fill="#dca16d" />
    </svg>
  );
}

function TeddyArtwork() {
  return (
    <svg {...commonProps}>
      {/* Seated teddy bear only: no bottle, shoes or rainbow. */}
      <ellipse cx="84" cy="96" rx="47" ry="5" fill="#cda89f" opacity=".18" />
      <circle cx="54" cy="33" r="16" fill="#c79372" />
      <circle cx="114" cy="33" r="16" fill="#c79372" />
      <circle cx="54" cy="33" r="8" fill="#e9baa0" />
      <circle cx="114" cy="33" r="8" fill="#e9baa0" />
      <ellipse cx="84" cy="77" rx="36" ry="29" fill="#d6a07c" />
      <ellipse cx="84" cy="79" rx="21" ry="18" fill="#f4d1b5" />
      <ellipse cx="53" cy="70" rx="12" ry="19" fill="#c79372" transform="rotate(20 53 70)" />
      <ellipse cx="115" cy="70" rx="12" ry="19" fill="#c79372" transform="rotate(-20 115 70)" />
      <ellipse cx="60" cy="90" rx="20" ry="13" fill="#c79372" />
      <ellipse cx="108" cy="90" rx="20" ry="13" fill="#c79372" />
      <ellipse cx="60" cy="91" rx="11" ry="7" fill="#e9baa0" />
      <ellipse cx="108" cy="91" rx="11" ry="7" fill="#e9baa0" />
      <circle cx="84" cy="42" r="35" fill="#d6a07c" />
      <ellipse cx="84" cy="55" rx="19" ry="14" fill="#f4d1b5" />
      <circle cx="73" cy="40" r="3.3" fill="#493531" />
      <circle cx="95" cy="40" r="3.3" fill="#493531" />
      <path d="M78 51q6-6 12 0l-6 5Z" fill="#6b4542" />
      <path d="M84 56v5m0 0q-4 4-8 0m8 0q4 4 8 0" fill="none" stroke="#6b4542" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="65" cy="52" r="5" fill="#e7a19b" opacity=".55" />
      <circle cx="103" cy="52" r="5" fill="#e7a19b" opacity=".55" />
    </svg>
  );
}

function LedArtwork() {
  const strands = [25, 45, 65, 85, 105, 125, 145];
  return (
    <svg {...commonProps}>
      <path d="M13 16h142" fill="none" stroke="#b69d91" strokeWidth="4" strokeLinecap="round" />
      {strands.map((x, index) => (
        <g key={x}>
          <path d={"M" + x + " 16v" + (index % 2 === 0 ? 57 : 48)} stroke="#bdaaa0" strokeWidth="1.4" opacity=".65" />
          {[28, 43, 58].filter((y) => index % 2 === 0 || y < 58).map((y) => (
            <g key={y}>
              <circle cx={x} cy={y} r="6.5" fill="#ffe0a5" opacity=".27" />
              <circle cx={x} cy={y} r="2.8" fill="#ffd08a" />
              <circle cx={x - 0.7} cy={y - 0.7} r=".9" fill="#fff9e9" />
            </g>
          ))}
        </g>
      ))}
      <ellipse cx="84" cy="95" rx="67" ry="5" fill="#bd9c87" opacity=".2" />
      <rect x="46" y="73" width="22" height="20" rx="5" fill="#fff9ef" stroke="#d4c2ac" strokeWidth="1.4" />
      <rect x="79" y="68" width="24" height="25" rx="5" fill="#fff9ef" stroke="#d4c2ac" strokeWidth="1.4" />
      <rect x="116" y="77" width="19" height="16" rx="5" fill="#fff9ef" stroke="#d4c2ac" strokeWidth="1.4" />
      <path d="M57 73q-5-5 0-12 5 6 0 12ZM91 68q-5-5 0-12 5 6 0 12ZM125 77q-5-5 0-11 5 6 0 11Z" fill="#ffbf64" />
      <path d="M57 69q-2-3 0-5 2 2 0 5ZM91 64q-2-3 0-5 2 2 0 5ZM125 73q-2-3 0-5 2 2 0 5Z" fill="#fff9dc" />
    </svg>
  );
}

/** Small, accessible-by-label illustrations, with no remote asset requests. */
export function HeroCategoryArt({ kind }: { kind: HeroCategoryKind }) {
  switch (kind) {
    case "birthday":
      return <BirthdayArtwork />;
    case "gift":
      return <GiftArtwork />;
    case "baby":
      return <TeddyArtwork />;
    case "led":
      return <LedArtwork />;
  }
}

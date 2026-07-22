export function HeroBackgroundShapes() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      {/* Vector 3 - 상단 중앙/좌측으로 길게 지나가는 조약돌 */}
      <div className="absolute left-[400px] top-[-109px] h-[450px] w-[585px] rotate-[-50.06deg] bg-fill-surface opacity-70 [border-radius:90%_20%_55%_45%/45%_48%_52%_55%]" />

      {/* Vector 1 - 우측 상단 큰 조약돌 */}
      <div className="absolute left-[987px] top-[20px] h-[520px] w-[325px] rotate-[66.63deg] bg-fill-surface [border-radius:55%_45%_34%_86%/44%_42%_78%_76%]" />

      {/* Vector 2 - 우측 중단 조약돌 */}
      <div className="absolute left-[1136px] top-[502px] h-[273px] w-[413px] rotate-[-10.68deg] bg-fill-surface opacity-90 [border-radius:62%_38%_50%_50%/45%_50%_58%_42%]" />

      {/* Vector 4 - 좌측 하단에서 삐져나오는 조약돌 */}
      <div className="absolute left-[-204px] top-[946.62px] h-[680px] w-[325px] rotate-[-82.25deg] bg-fill-surface [border-radius:48%_52%_38%_62%/58%_42%_54%_46%]" />
    </div>
  );
}
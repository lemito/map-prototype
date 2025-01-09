import Map from "@/components/Map";

export default function Home() {
  return (
    <div style={{ width: "50%", height: "100vh" }}>
      <h1>Тут пока только карта</h1>
      <p>
        Карта со спутником. Для рисования выбери пункт с квадратом на карте
        справа. Для того, чтобы получить координаты точек, нажми enter
      </p>
      <Map />
    </div>
  );
}

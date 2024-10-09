export function Map() {
  return (
    <iframe
      src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAm2Yp0P-RH1yzmKB-l3JtCL4Nh84y59RU&q=movie+theaters+near+340+W+50th+St"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      className="w-full h-full aspect-video rounded shadow"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}

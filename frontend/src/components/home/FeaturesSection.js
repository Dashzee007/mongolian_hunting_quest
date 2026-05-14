const FEATURES = [
  {
    icon: '🐾',
    title: 'Амьтдын мэдээллийн сан',
    desc: '24 гаруй амьтны дэлгэрэнгүй мэдээлэл, зураг, байршил, ангиллыг харна уу.',
  },
  {
    icon: '🗺️',
    title: 'Интерактив газрын зураг',
    desc: 'Монгол орны ан агнуурын бүсийг Google Maps шиг харж, бүс тус бүрийн амьтдыг судална уу.',
  },
  {
    icon: '🖼️',
    title: 'Зургийн сан',
    desc: 'Монголын зэрлэг амьтдын мэргэжлийн зургийн цуглуулгыг ангиллаар нь харна уу.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="features">
      <h2>Системийн боломжууд</h2>
      <p>Монголын зэрлэг амьтдын тухай бүх мэдээллийг нэг дор</p>

      <div className="feature-grid">
        {FEATURES.map(({ icon, title, desc }) => (
          <article key={title} className="feature">
            <span className="feature-icon">{icon}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export class Animal {
  constructor(data) {
    // Класс ашиглан өгөгдлийг загварчилж авна
    this.name = data.name;
    this.region = data.region;
    this.type = data.type;
    this.description = data.description;
    this.image = data.image;
  }

  render() {
    return `
      <div class="animal-card">
        <img src="${this.image}" alt="${this.name}">
        <div class="card-body">
          <h3>${this.name}</h3>
          <p class="meta">${this.type} · ${this.region}</p>
          <p>${this.description}</p>
        </div>
      </div>
    `;
  }
}
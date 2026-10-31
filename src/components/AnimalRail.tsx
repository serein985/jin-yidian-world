import type { AnimalProfile } from "../domain/world";

interface AnimalRailProps {
  animals: AnimalProfile[];
  activeAnimalId: string | null;
  onSelect: (animalId: string) => void;
}

function initials(name: string) {
  return name.slice(0, 1);
}

export function AnimalRail({
  animals,
  activeAnimalId,
  onSelect,
}: AnimalRailProps) {
  if (!animals.length) {
    return null;
  }

  return (
    <nav className="animal-rail" aria-label="我的动物">
      {animals.map((animal) => (
        <button
          key={animal.id}
          type="button"
          className={`animal-rail__item animal-rail__item--${animal.theme} ${
            animal.id === activeAnimalId ? "is-active" : ""
          }`}
          aria-label={`切换到${animal.name}`}
          aria-current={animal.id === activeAnimalId ? "true" : undefined}
          onClick={() => onSelect(animal.id)}
        >
          <span>{initials(animal.name)}</span>
          <small>{animal.name}</small>
          <i>{animal.species}</i>
        </button>
      ))}
    </nav>
  );
}

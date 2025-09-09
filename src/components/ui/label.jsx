import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils/cn"; // Assurez-vous que ce chemin est correct

// Définition du composant Label
// Ce composant est basé sur la primitive de Label de Radix UI et peut être étendu.
// Il utilise la fonction `cn` pour fusionner les classes Tailwind CSS de manière conditionnelle.

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    // Utilisez 'cn' pour appliquer des classes de base et celles passées via props
    // Les classes de base définissent l'apparence par défaut du label
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label"; // Nom d'affichage pour le débogage React

export { Label };

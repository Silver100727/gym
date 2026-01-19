import * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-white/10 bg-dark-lighter text-white shadow-sm",
        className
      )}
      {...props}
    />
  );
}
Card.displayName = "Card";
Card = React.forwardRef(Card);

function CardHeader({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}
CardHeader.displayName = "CardHeader";
CardHeader = React.forwardRef(CardHeader);

function CardTitle({ className, ...props }, ref) {
  return (
    <h3
      ref={ref}
      className={cn("font-heading text-2xl font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}
CardTitle.displayName = "CardTitle";
CardTitle = React.forwardRef(CardTitle);

function CardDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-light", className)}
      {...props}
    />
  );
}
CardDescription.displayName = "CardDescription";
CardDescription = React.forwardRef(CardDescription);

function CardContent({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}
CardContent.displayName = "CardContent";
CardContent = React.forwardRef(CardContent);

function CardFooter({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}
CardFooter.displayName = "CardFooter";
CardFooter = React.forwardRef(CardFooter);

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

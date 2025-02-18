"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Navbar from "./components/Navbar";
import Section from "./components/Section";
import ScrollButton from "./components/ScrollButton";


export default function Home() {
  const { data: session, status, update } = useSession();
  const [userName, setUserName] = useState("Your");
  const [activeSection, setActiveSection] = useState("books");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      setUserName(session.user.name);
    }
  }, [session?.user?.name, status]);

  const handleSignIn = async () => {
    await signIn("google");
    await update();
  };

  const handleSignOut = async () => {
    await signOut();
    setUserName("Your");
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Navbar 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        userName={userName} 
        handleSignIn={handleSignIn} 
        handleSignOut={handleSignOut} 
      />

      <Section id="books" title={`${userName}'s Library`} description="Like BookReads but better." backgroundImage="/background.jpg" link="/books" />
      <ScrollButton targetId="movies" onClick={scrollToSection} />

      <Section id="movies" title={`${userName}'s Movie Collection`} description="A curated list of must-watch movies." backgroundImage="/movies-background.jpg" link="/movies" />
      <ScrollButton targetId="recipes" onClick={scrollToSection} />

      <Section id="recipes" title={`${userName}'s Recipes`} description="Delicious recipes for every taste." backgroundImage="/recipes-background.jpg" link="/recipes" />
    </div>
  );
}

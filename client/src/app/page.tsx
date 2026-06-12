"use client";
import { Text } from "@/components/atoms/Text/Text";
import { useToasts, useToastsDispatch } from "@/context/ToastContext";

export default function Home() {
  const dispatch = useToastsDispatch();
  const toasts = useToasts();

  return (
    <main className="flex flex-col gap-8 min-h-screen px-24 py-8 mx-auto">
      <Text textType="header" text="TTRPG Dungeon Planner" />
      <Text textType="default" text="Welcome to the TTRPG Dungeon Planner!" />

      <div className="flex flex-col gap-2">
        <Text textType="subheader" text="Purpose" />
        <Text
          textType="default"
          text="The TTRPG planner exists to help game masters create dungeons. It aims to automate much of the maths when creating encounters and allows for the exporting of the created dungeons to markdown and JSON for interoperability with other tools."
        />
      </div>
      <div className="flex flex-col gap-2">
        <Text textType="subheader" text="Getting Started" />
        <Text
          textType="default"
          text="You will likely want to create traps and monsters on the respective pages. Each of these pages is a simple form which walks the user through the creation of one or more traps / monsters.
        "
        />
        <Text
          textType="default"
          text="Once this has been completed, you will then likely want to navigate to the 'Dungeons' page. This page consists of two parts: Dungeons and Rooms."
        />
        <Text
          textType="default"
          text="To get to the 'Room' section, you will first need to create a dungeon using the form. Once a dungeon has been created, you can then navigate to the 'Rooms' tab within the Dungeon. This is also a form that will allow a user to create one or more rooms inside a dungeon. Each room will be given a rating of either trivial, easy, medium, hard or extreme. These ratings are based on 'encounter multipliers' and 'encounter ratings' which can be created using the wizard scripts, mentioned below."
        />
        <Text
          textType="default"
          text="Created dungeons can be exported into two formats: markdown and JSON"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Text textType="subheader" text="Wizard Scripts" />
        <Text
          textType="default"
          text="Two operations cannot currently be performed via the web user-interface: the creation of 'encounter ratings' and 'encounter multipliers'. Instead, these are performed via command-line wizards. Both wizards are accessed via a single command-line script."
        />
        <Text
          textType="default"
          text="See the README.md file for more information on the wizard scripts"
        />
      </div>
    </main>
  );
}

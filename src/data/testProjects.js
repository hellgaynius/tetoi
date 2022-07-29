// As backslash is an escape symbol, we need to write six of them in the code
// so that three of them appear on the webpage.
// The lines with text are not indented to render normally on the webpage as well.

import { nanoid } from 'nanoid';

export const testProjects = {
  project_1: {
    name: 'project_1',
    title: 'The Little Mermaid',
    post: {
      fullText: `The Little Mermaid
by
Hans Christian Andersen
(1836)
      Far out in the ocean, where the water is as blue as the prettiest cornflower, and as clear as crystal, it is very, very deep; so deep, indeed, that no cable could fathom it: many church steeples, piled one upon another, would not reach from the ground beneath to the surface of the water above. There dwell the Sea King and his subjects. We must not imagine that there is nothing at the bottom of the sea but bare yellow sand. No, indeed; the most singular flowers and plants grow there; the leaves and stems of which are so pliant, that the slightest agitation of the water causes them to stir as if they had life. Fishes, both large and small, glide between the branches, as birds fly among the trees here upon land. In the deepest spot of all, stands the castle of the Sea King. Its walls are built of coral, and the long, gothic windows are of the clearest amber. The roof is formed of shells, that open and close as the water flows over them. Their appearance is very beautiful, for in each lies a glittering pearl, which would be fit for the diadem of a queen.
The Sea King had been a widower for many years, and his aged mother kept house for him. She was a very wise woman, and exceedingly proud of her high birth; on that account she wore twelve oysters on her tail; while others, also of high rank, were only allowed to wear six. She was, however, deserving of very great praise, especially for her care of the little sea-princesses, her grand-daughters. They were six beautiful children; but the youngest was the prettiest of them all; her skin was as clear and delicate as a rose-leaf, and her eyes as blue as the deepest sea; but, like all the others, she had no feet, and her body ended in a fish’s tail. All day long they played in the great halls of the castle, or among the living flowers that grew out of the walls. The large amber windows were open, and the fish swam in, just as the swallows fly into our houses when we open the windows, excepting that the fishes swam up to the princesses, ate out of their hands, and allowed themselves to be stroked. Outside the castle there was a beautiful garden, in which grew bright red and dark blue flowers, and blossoms like flames of fire; the fruit glittered like gold, and the leaves and stems waved to and fro continually. The earth itself was the finest sand, but blue as the flame of burning sulphur. Over everything lay a peculiar blue radiance, as if it were surrounded by the air from above, through which the blue sky shone, instead of the dark depths of the sea. In calm weather the sun could be seen, looking like a purple flower, with the light streaming from the calyx. Each of the young princesses had a little plot of ground in the garden, where she might dig and plant as she pleased. One arranged her flower-bed into the form of a whale; another thought it better to make hers like the figure of a little mermaid; but that of the youngest was round like the sun, and contained flowers as red as his rays at sunset. She was a strange child, quiet and thoughtful; and while her sisters would be delighted with the wonderful things which they obtained from the wrecks of vessels, she cared for nothing but her pretty red flowers, like the sun, excepting a beautiful marble statue. It was the representation of a handsome boy, carved out of pure white stone, which had fallen to the bottom of the sea from a wreck. She planted by the statue a rose-colored weeping willow. It grew splendidly, and very soon hung its fresh branches over the statue, almost down to the blue sands. The shadow had a violet tint, and waved to and fro like the branches; it seemed as if the crown of the tree and the root were at play, and trying to kiss each other. Nothing gave her so much pleasure as to hear about the world above the sea. She made her old grandmother tell her all she knew of the ships and of the towns, the people and the animals. To her it seemed most wonderful and beautiful to hear that the flowers of the land should have fragrance, and not those below the sea; that the trees of the forest should be green; and that the fishes among the trees could sing so sweetly, that it was quite a pleasure to hear them. Her grandmother called the little birds fishes, or she would not have understood her; for she had never seen birds.

“When you have reached your fifteenth year,” said the grand-mother, “you will have permission to rise up out of the sea, to sit on the rocks in the moonlight, while the great ships are sailing by; and then you will see both forests and towns.”
`, 
      slots: [
        {
          text: `# -=- The Little Mermaid

--= *by   
Hans Christian Andersen 
(1836)*
          `,
          id: nanoid(),
        },
        {
          text: `-=- **Far out in the ocean**,
*where the water is:*
1. *as **blue** as the prettiest cornflower,*
2. *as **clear** as crystal,*

it is very, very **deep**; so deep, indeed, that no cable could fathom it: many church steeples, piled one upon another, would not reach from the ground beneath to the surface of the water above. 
*There dwell the Sea King and his subjects. We must not imagine that there is nothing at the bottom of the sea but bare yellow sand. No, indeed; the most singular flowers and plants grow there;  the leaves and stems of which are so pliant, that the slightest agitation of the water causes them to stir as if they had life.*
___
          `,
          id: nanoid(),
        }, 
        {
          text: `Fishes, both:
- large and 
- small, 

glide between the branches, as birds fly among the trees here upon land. In the deepest spot of all, stands the castle of the **Sea King**. Its walls are built of coral, and the long, gothic windows are of the clearest amber. The roof is formed of shells, that open and close as the water flows over them. Their appearance is very beautiful, for in each lies a glittering pearl, which would be fit for the diadem of a queen.

> The Sea King had been a widower for many years, and his aged mother kept house for him.
          `,
          id: nanoid(),
        },
        {
          text: `###### -=- Granny and kids
She was a *very* wise woman, and exceedingly proud of her high birth; on that account she wore twelve oysters on her tail; while others, also of high rank, were only allowed to wear six. She was, however, deserving of very great praise, especially for her care of the little sea-princesses, her grand-daughters. 
*They were six beautiful children;* but the **youngest** was the **prettiest** of them all; her skin was as clear and delicate as a rose-leaf, and her eyes as blue as the deepest sea.
> like all the others, she had no feet, and her body ended in a fish’s tail. 
          `,
          id: nanoid(),
        },
        {
          text: `###### -=- Routine of the Mermaid and her sisters
\\\\\\
> All day long they played in the great halls of the castle, or among the living flowers that grew out of the walls. The large amber windows were open, and the fish swam in, just as the swallows fly into our houses when we open the windows, excepting that the fishes swam up to the princesses, ate out of their hands, and allowed themselves to be stroked. 
          `,
          id: nanoid(),
        },
        {
          text: `###### -=- Some facts about home 
1. Outside the castle there was a beautiful garden, in which grew bright red and dark blue flowers, and blossoms like flames of fire; the fruit glittered like gold, and the leaves and stems waved to and fro continually. 
2. The earth itself was the finest sand, but blue as the flame of burning sulphur. 
3. Over everything lay a peculiar blue radiance, as if it were surrounded by the air from above, through which the blue sky shone, instead of the dark depths of the sea. 
4. In calm weather the sun could be seen, looking like a purple flower, with the light streaming from the calyx. 
          `,
          id: nanoid(),
        },
        {
          text: `###### -=- The Mermaid's nature
\\\\\\
Each of the young princesses had a little plot of ground in the garden, where she might dig and plant as she pleased. 
- one arranged her flower-bed into the form of a whale; 
- another thought it better to make hers like the figure of a little mermaid; 

but that of the youngest was round like the sun, and contained flowers as red as his rays at sunset. 
> She was a strange child, **quiet and thoughtful**.
          `,
          id: nanoid(),
        },
        {
          text: `###### -=- The Mermaid's nature
And while her sisters would be delighted with the wonderful things which they obtained from the wrecks of vessels, she cared for nothing but her pretty red flowers, like the sun, *excepting a beautiful **marble statue***. It was the representation of a handsome boy, carved out of pure white stone, which had fallen to the bottom of the sea from a wreck. 
She planted by the statue a rose-colored weeping willow. It grew splendidly, and very soon hung its fresh branches over the statue, almost down to the blue sands. The shadow had a violet tint, and waved to and fro like the branches; it seemed as if the crown of the tree and the root were at play, and trying to kiss each other. 
          `,
          id: nanoid(),
        },
        {
          text: `###### -=- What else about her?
> Nothing gave her so much pleasure as to hear about the world above the sea:

She made her old grandmother tell her all she knew of the ships and of the towns, the people and the animals. 
To her it seemed most wonderful and beautiful to hear 
- that the flowers of the land should have fragrance, and not those below the sea; 
- that the trees of the forest should be green; 
- and that the fishes among the trees could sing so sweetly, that it was quite a pleasure to hear them.
          `,
          id: nanoid(),
        },
        {
          text: `Her grandmother called the little birds fishes, or she would not have understood her; for she had never seen birds.
\\\\\\
> *“When you have reached your fifteenth year,”*

-=- said the grand-mother, 

> *“you will have permission to rise up out of the sea, to sit on the rocks in the moonlight, while the great ships are sailing by; and then you will see both forests and towns.”*

\\\\\\
###### --= ...to be continued
          `,
          id: nanoid(),
        },
      ],
    },
    
    settings: {
      headingsFontFallback: "sans-serif",
      mainTextFontFallback: "serif",
      settings: {
        paddings: {
          bottom: 20,
          left: 20,
          right: 20,
          top: 20,
        },
        textApplicants: {
          headings: {
            font: 'Philosopher', 
            fontSize: 16, 
            lineHeight: 1.2,
          },
          mainText: {
            font: 'Cormorant Infant', 
            fontSize: 17, 
            lineHeight: 1.1,
          },
        },
      },
    },
  },

  project_2: {
    title: 'Destructurization',
    name: 'project_2',
    post: {
      fullText: 'test project #2 (there will be no full text of the project haha)', 
      slots: [
        {
          text: `### **JavaScript**
##### Destructuring Assignment with Default Values
\\\\\\
*1 min read*
          `,
          id: nanoid(),
        },
        {
          text: `# Intro
*The destructuring assignment - what it is?*
\\\\\\
It's a new syntax to get a part of an array or of an object and assign it to a variable in a more convenient way. 
> --= It is also possible to set default values when using destructuring assignment.
          `,
          id: nanoid(),
        }, 
        {
          text: `###### Here is an example code snippet:
\\\\\\
\`const user = { name: 'Zaiste' };\`

\`const { name, age } = user;
console.log(age);\`
\`undefined\`
> --= ***const*** creates variables, so in this example age is ***undefined***.
          `,
          id: nanoid(),
        },
        {
          text: `###### See the syntax of default values:
\\\\\\
\`const user = {
  name: 'Zaiste',
}\`

\`const { name = 'Basia', age = 21 } = user;
console.log(name);
console.log(age);\`
output: 
> - Zaiste
> - 21
          `,
          id: nanoid(),
        },
        {
          text: `### Important note
Default values in destructuring assignement only work if the variables either _don't exist_ or their value is _set to undefined_. 
\\\\\\
Any other value, including:
1. --= ___null___
2. --= ___false___ 
3. --= ___0___

bypasses the default values in the destructuring statement.
          `,
          id: nanoid(),
        },
        {
          text: `\\\\\\
\\\\\\
\\\\\\
\\\\\\
\\\\\\
# -=- That's it for now!
-=- Hope you enjoyed!
          `,
          id: nanoid(),
        },
      ],
    },
    
    settings: {
      headingsFontFallback: "sans-serif",
      mainTextFontFallback: "serif",
      settings: {
        paddings: {
          bottom: 20,
          left: 20,
          right: 20,
          top: 20,
        },
        textApplicants: {
          headings: {
            font: 'Jura', 
            fontSize: 16, 
            lineHeight: 1,
          },
          mainText: {
            font: 'Finlandica', 
            fontSize: 18, 
            lineHeight: 1.2,
          },
        },
      },
    },
  },
}

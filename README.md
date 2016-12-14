# eSpark Learning Programming Challenge
This project is part of the eSpark Learning engineering interview process. The resulting application is live and can be used at https://espark-50d82.firebaseapp.com.

## Design
I imagined the experience was intended to be used by two people: the 3rd grader as well as a teacher/designer presenting the UX Test to the 3rd grader.  This was the main story I was designing against and I assumed the experience would be used on a Chromebook in a classroom.  I thought about 3rd graders for some time and researched online for 3rd grader learning models.  I did a design analysis of Khan Academy's 3rd grade curriculum to get some context for instructional videos followed by questions and found the Common Core Standards to understand more about how 3rd graders are expected to learn.

I sketched out a variety of components and workflows for the experience to uncover more questions, make decisions and refine details ([see sketches](https://github.com/gbhatnag/eSpark/wiki/Design-Sketches)).

I decided the three variants would test whether providing reflection after the video increases student reflection and comprehension.  For this, the video and questions would need to be fixed and only the reflection portion of the experience would vary.  The first variant (A) would prompt the student for free-form reflection in their own words.  The second variant (B) would prompt the student to reflect on the video by selecting from given topics.  The third variant (C) would act as a control -- there would be no reflection and the student would be taken directly to the questions.  To determine which of the three variants is most effective at increasing reflection and comprehension, the data section of the application would need to display the overall scores achieved in all tests.

## Development
I decided to use React + Firebase for this application because I have been using this combination of technologies on [another project](https://github.com/gbhatnag/africandrumminglaws) and could quickly scaffold the type of experience we needed.  React also lends itself well to the simple step-by-step nature of this experience with each step in the process using a corresponding component.  I used the [Paper Bootstrap theme](https://bootswatch.com/paper/) in keeping with the Chromebook aesthetic.

The questions and reflection topics I came up with are not very well-informed from a pedagogical perspective -- I'm not sure if the prompts and questions I've currently included actually encourage reflection or validate comprehension.  If I were to continue working on this, I would like to get the feedback of an informed educator to review the video, prompts and questions.

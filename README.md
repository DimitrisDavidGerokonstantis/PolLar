# PolLar
This is a web application for creating polls. Its functionality is described below. The app is publicly available and one can have access to it using this link : https://pollar-app.onrender.com.

## Purpose and Main Idea 
The main purpose of creating this platform is the integration of the main stages of collective decision making : 
  1. Submission of suggestions by the members of the poll
  2. Voting of these suggestions (specifically, each participant votes for 3 suggestions, ranking them in order of preference)
  3. Results 
PoLlar polls go through these 3 phases.

## Roles
There are 2 roles in each PolLar poll :
  1. Admin : The creator of the poll, he defines the main parameters of the poll (such as the number of participants).
  >[!IMPORTANT]
  > The admin of the poll does not define which options (or suggestions) will be voted on. The purpose of PolLar is to collect suggestions from all the participants of the poll!
  2. Participant : participants can make suggestions, vote and finally see the results of the poll. If the corresponding option is enabled, participants can see the suggestions of other participants during the suggestions' phase

## A complete use case
The main page of PolLar is the one below.
![Screenshot from 2024-02-16 20-33-22](https://github.com/DimitrisDavidGerokonstantis/-PolarDeploy/assets/106912404/52c2bead-1d6c-44ee-bf22-1a211fda8d15)

There are 3 sections, one for joining a poll, one for creating a poll and one for checking the status of a poll (for admins). Firstly, one can create a poll defining the parameters of it. An example is shown below.
![Screenshot from 2024-02-16 20-38-39](https://github.com/DimitrisDavidGerokonstantis/-PolarDeploy/assets/106912404/6b6a1439-1540-4868-a2a8-369e24182049)

The creator of a poll defines its title, the number of participants and the number of suggestions that each participant will able to make. Also, he defines the points that a suggestion earns when a participant votes for it in a specific ranking (ranking 1 = best option, ranking 3 = worst option). In this example we allow participants to vote again for the same participant while voting for a different rank. For example, participant P1 will be able to vote for Movie M1 (suggested by P2) as his best movie and then vote for Movie M2 (suggested by P2 again) as his 2nd best movie. Otherwise, if a participant votes for a movie suggested by participant P, he will not be able to vote for a movie of the same participant in a different ranking. We also allow participants to be able to see the current suggestions of other participants during the suggestions' phase. The participants' usernames are being created automatically but you can modify them. You will not be allowed to add 2 usernames with the same value. Participants' usernames are unique for every poll. In this page, you can notice the existence of some error messages when you add an invalid value in a specific field. For example if you try to add a character (not a number) as the number of participants or add a very long username, an error will be shown. You will not be allowed to create the poll while an error has been found. 

After these steps, we create the poll. 
![Screenshot from 2024-02-16 20-52-01](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/5c3711d6-e872-4749-adb5-d833c19c69d6)

We can notice 2 useful features:
  * You can download a .txt file containing information about the poll (all the parameters defined by the creator plus the participants' usernames)
![Screenshot from 2024-02-16 20-56-27](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/fc4dd285-06a6-4202-960b-74f55d83b4bc)
  * You can send invitations via email (use of emailjs package)


**-- To be updated --**

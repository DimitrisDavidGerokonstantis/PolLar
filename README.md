# PolLar
This is a web application for creating polls. Its functionality is described below. The app is publicly available and one can have access to it using this link : https://pollar-app.onrender.com.

## Purpose and Main Idea 
The main purpose of creating this platform is the integration of the main stages of collective decision making : 
  1. Submission of suggestions by the members of the poll
  2. Vote on these suggestions (specifically, each participant votes for 3 suggestions, ranking them in order of preference)
  3. Results
     
PolLar polls go through these 3 phases.

## Roles
There are 2 roles in each PolLar poll :
  1. Admin : The creator of the poll, he defines the main parameters of the poll (such as the number of participants).
  >[!IMPORTANT]
  > The admin of the poll does not define which options (or suggestions) will be voted on. The purpose of PolLar is to collect suggestions from all the participants of the poll!
  2. Participant : participants can make suggestions, vote and finally see the results of the poll. If the corresponding option is enabled, participants can see the suggestions of other participants during the suggestions' phase

## A complete use case
The main page of PolLar is the one below.
![Screenshot from 2024-02-16 20-33-22](https://github.com/DimitrisDavidGerokonstantis/-PolarDeploy/assets/106912404/52c2bead-1d6c-44ee-bf22-1a211fda8d15)

There are 3 sections, one for joining a poll, one for creating a poll and one for checking the status of a poll (for admins). 

### Poll Creation
Firstly, one can create a poll defining the parameters of it. An example is shown below.
![Screenshot from 2024-02-16 20-38-39](https://github.com/DimitrisDavidGerokonstantis/-PolarDeploy/assets/106912404/6b6a1439-1540-4868-a2a8-369e24182049)

The creator of a poll defines its title, the number of participants and the number of suggestions that each participant will be able to make. Also, he defines the points that a suggestion earns when a participant votes for it in a specific ranking (ranking 1 = best option, ranking 3 = worst option). In this example we allow participants to vote again for the same participant while voting for a different rank. For example, participant P1 will be able to vote for Movie M1 (suggested by P2) as his best movie and then vote for Movie M2 (suggested by P2 again) as his 2nd best movie. Otherwise, if a participant votes for a movie suggested by participant P, he will not be able to vote for a movie of the same participant in a different ranking. We also allow participants to be able to see the current suggestions of other participants during the suggestions' phase. The participants' usernames are being created automatically but you can modify them. You will not be allowed to add 2 usernames with the same value. Participants' usernames are unique for every poll. In this page, you can notice the existence of some error messages when you add an invalid value in a specific field. For example if you try to add a character (not a number) as the number of participants or add a very long username, an error will be shown. You will not be allowed to create the poll if an error has been found. 

After these steps, we create the poll. 
![Screenshot from 2024-02-16 20-52-01](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/5c3711d6-e872-4749-adb5-d833c19c69d6)

We can notice 2 useful features:
  * You can download a .txt file containing information about the poll (all the parameters defined by the creator plus the participants' usernames and the poll's password)
    
![Screenshot from 2024-02-16 20-56-27](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/fc4dd285-06a6-4202-960b-74f55d83b4bc)
  * You can send (and resend) invitations via email (use of emailjs package) for each username that was produced (usernames cannot be changed anymore, these fields are read only). These emails have the format that you can see below.
    
![Screenshot from 2024-02-16 20-59-52](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/083272ab-7e2b-4c39-8798-19c94f614425)

### Make suggestions
Then we can join this poll and make suggestions using a participants' username and the poll's password. We can also define a nickname. Usernames are not public to everyone (the reason is obvious), so when we see information about other participants (such as their current suggestions) we will only see their nicknames and not their usernames. 

![Screenshot from 2024-02-16 21-06-09](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/7f58aede-996e-436d-9d9a-4b0a87e0b857)

Then, a participant can make his suggestions and see the current suggestions of other participants.

![Screenshot from 2024-02-16 21-09-34](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/5e0f3bf5-a8ba-45c2-b010-755df63d273b)

After this, a participant can modify his suggestions. Every time he joins this poll, this participant will be forwarded into this page. 

![Screenshot from 2024-02-16 21-11-28](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/5bf188f9-3844-41b4-937e-925e0e45b901)

At the same time, the admin of the poll can see the status of the poll when he chooses the "Check your poll's status" button. 

![Screenshot from 2024-02-16 21-14-07](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/f41f4bab-5039-4873-b419-d57da8bcfadd)

The admin sees that only 1 participant has made suggestions, thus he cannot pass the poll into next (voting) phase. He can also refresh this page in order to see the latest suggestions made by participants.

When all participants have made suggestions, admin can start the voting phase.

![Screenshot from 2024-02-16 21-19-02](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/6ef339ac-7b4d-43a9-b996-df52e2b44ab8)

### Voting Phase
At this point, each participant can vote his 3 best movies in preference order. Of course, he cannot vote for his own suggestions. 

![Screenshot from 2024-02-16 21-21-24](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/021665d6-788d-4c00-ac80-59c86a0b0da6)
![Screenshot from 2024-02-16 21-23-00](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/26186925-8acb-46fc-a790-bcc30cf85416)

During the voting phase, each participant can modify his votes. Also, every time he joins the poll, he will be navigated to this page. 

![Screenshot from 2024-02-16 21-23-49](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/e3b6f163-a1cb-4e21-afbb-e96cad74a971)

From the admin's page, the admin can see how many participants have already voted. When all participants have voted, the admin can finish the poll. 

![Screenshot from 2024-02-16 21-28-24](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/771aabbf-21af-460d-a82e-b2d020333f33)

After this, the admin and all the participants (when visiting their pages) can see the results of the poll. The points of each suggestion have been computed according to the points that were defined by the admin when he created the poll. 
![Screenshot from 2024-02-16 21-41-00](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/c368f239-dc68-41a9-8f66-d2ec2c117359)

![Screenshot from 2024-02-16 21-41-16](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/00c68087-f991-48d7-9ada-5364317b1750)


>**To be updated in order to explain some non functional requirements that were met (for example, in order to ensure that only valid participants of a poll can join it)**

## What's next
One idea is to use the results of the poll and make some statistics and plots. 

Feel free to give feedback (pollar.app2024@gmail.com) in order to report errors/problems and suggest improvements and additions.









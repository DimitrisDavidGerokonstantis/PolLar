# PolLar
This is a web application for creating polls. Its functionality is described below. The app is publicly available and one can have access to it using this link : ~~https://pollar-app.onrender.com~~ https://pollar-app2024.web.app/main.

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
![Screenshot from 2024-09-28 20-04-10](https://github.com/user-attachments/assets/9abb79a8-c23b-4edc-8408-790134007cad)


There are 3 sections, one for joining a poll, one for creating a poll and one for checking the status of a poll (for admins). 

### Poll Creation
Firstly, one can create a poll defining the parameters of it. An example is shown below.
![Screenshot from 2024-09-28 20-07-15](https://github.com/user-attachments/assets/984f6c77-eaf0-4fba-a461-483e795d21ea)


The creator of a poll defines its title, the number of participants and the number of suggestions that each participant will be able to make. Also, he defines the points that a suggestion earns when a participant votes for it in a specific ranking (ranking 1 = best option, ranking 3 = worst option). In this example we allow participants to vote again for the same participant while voting for a different rank. For example, participant P1 will be able to vote for Movie M1 (suggested by P2) as his best movie and then vote for Movie M2 (suggested by P2 again) as his 2nd best movie. Otherwise, if a participant votes for a movie suggested by participant P, he will not be able to vote for a movie of the same participant in a different ranking. We also allow participants to be able to see the current suggestions of other participants during the suggestions' phase. The participants' usernames are being created automatically but you can modify them. You will not be allowed to add 2 usernames with the same value. Participants' usernames are unique for every poll. In this page, you can notice the existence of some error messages when you add an invalid value in a specific field. For example if you try to add a character (not a number) as the number of participants or add a very long username, an error will be shown. You will not be allowed to create the poll if an error has been found. 

After these steps, we create the poll. 
![Screenshot from 2024-09-28 20-08-50](https://github.com/user-attachments/assets/9f9fe4e4-a062-46fb-bb45-8695e271878e)
![Screenshot from 2024-09-28 20-08-24](https://github.com/user-attachments/assets/8e48e28c-985c-4ebb-870e-84397df9f4bb)

We can notice 2 useful features:
  * You can download a .txt file containing information about the poll (all the parameters defined by the creator plus the participants' usernames and the poll's password)
    
![Screenshot from 2024-02-16 20-56-27](https://github.com/DimitrisDavidGerokonstantis/PolLar/assets/106912404/fc4dd285-06a6-4202-960b-74f55d83b4bc)
  * You can send (and resend) invitations via email (use of emailjs package) for each username that was produced (usernames cannot be changed anymore, these fields are read only). These emails have the format that you can see below.
    
![Screenshot from 2024-09-29 21-56-07](https://github.com/user-attachments/assets/c3d1ac6a-0ca8-45c7-ba92-75b8e6017e41)


### Make suggestions
Then we can join this poll and make suggestions using a participants' username and the poll's password. We can also define a nickname. Usernames are not public to everyone (the reason is obvious), so when we see information about other participants (such as their current suggestions) we will only see their nicknames and not their usernames. 

![Screenshot from 2024-09-28 20-10-58](https://github.com/user-attachments/assets/f489fbf8-f1cb-4a8e-b230-76544b92ae30)


Then, a participant can make his suggestions and see the current suggestions of other participants.
![Screenshot from 2024-09-28 20-12-33](https://github.com/user-attachments/assets/72fde036-f317-434e-9e99-5dac10e447cf)


After this, a participant can modify his suggestions. Every time he joins this poll, this participant will be forwarded into this page. 

![Screenshot from 2024-09-28 20-14-09](https://github.com/user-attachments/assets/5886fa79-fe48-4be6-a8d3-a8a83424fe3b)


At the same time, the admin of the poll can see the status of the poll when he chooses the "Check your poll's status" button. 
![Screenshot from 2024-09-28 20-16-15](https://github.com/user-attachments/assets/dd823cd8-8f07-428d-a0b9-2567b6d44630)
![Screenshot from 2024-09-28 20-22-05](https://github.com/user-attachments/assets/d045a3f4-4c2d-4bf8-a04d-195dceaa2438)


The admin sees that only 1 participant has made suggestions, thus he cannot pass the poll into next (voting) phase. He can also refresh this page in order to see the latest suggestions made by participants.

When all participants have made suggestions, admin can start the voting phase.
![Screenshot from 2024-09-28 20-21-53](https://github.com/user-attachments/assets/0cac4227-d754-4879-bc5b-ed5f826ca6f6)

### Voting Phase
At this point, each participant can vote his 3 best movies in preference order. Of course, he cannot vote for his own suggestions. 
![Screenshot from 2024-09-28 20-25-18](https://github.com/user-attachments/assets/e61db247-7100-4f03-be4c-b8af6cb76643)


During the voting phase, each participant can modify his votes. Also, every time he joins the poll, he will be navigated to this page. 
![Screenshot from 2024-09-28 20-27-05](https://github.com/user-attachments/assets/cd8b6784-1431-48f9-81bf-af1dc3a68cbd)


From the admin's page, the admin can see how many participants have already voted. When all participants have voted, the admin can finish the poll. 
![Screenshot from 2024-09-28 20-28-04](https://github.com/user-attachments/assets/84044c0f-51c7-44f4-8e5a-c338540300fa)


After this, the admin and all the participants (when visiting their pages) can see the results of the poll. The points of each suggestion have been computed according to the points that were defined by the admin when he created the poll. 
![Screenshot from 2024-09-28 20-33-01](https://github.com/user-attachments/assets/5a16da41-ab1b-4138-978b-d58f10bbdb0b)

![Screenshot from 2024-09-28 20-33-08](https://github.com/user-attachments/assets/c6ae52b8-85d9-4b8e-b88b-9a826a3524ac)


>**To be updated in order to explain some non functional requirements that were met (for example, in order to ensure that only valid participants of a poll can join it)**

## What's next
One idea is to use the results of the poll and produce some statistics and plots. 

Feel free to give feedback (pollar.app2024@gmail.com) in order to report errors/problems and suggest improvements and additions.









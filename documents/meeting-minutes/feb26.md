## Agenda
- Discuss current state of architecture
- Ideate solutions for search implementation and course population

## Notes 
- Adam and David discussed wether it would be best to keep all data in mongodb
  - Currently course information is stored in the backend
- Potential solutions:
  - Keep course information in the backend but keep notes and user added information in mongodb
  - Keep course information as well as any user added information in mongodb
- Discussed how we should store profile pictures
  - Could limit users to predefined profile pictures to choose from
  - If users can upload images we will need to figure out a storage solution
- Decided to vitualize course population to reduce client load
- Decided to use timeouts in search functionality to optimize query performance
- Discussed front-end to back-end communication file structure
- Discussed using vscode live share feature to collaborate on code

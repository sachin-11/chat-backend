import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { floor, random } from 'lodash';
import axios from 'axios';

dotenv.config({});

function avatarColor(): string {
  const colors: string[] = [
    '#f44336',
    '#e91e63',
    '#2196f3',
    '#9c27b0',
    '#3f51b5',
    '#00bcd4',
    '#4caf50',
    '#ff9800',
    '#8bc34a',
    '#009688',
    '#03a9f4',
    '#cddc39',
    '#2962ff',
    '#448aff',
    '#84ffff',
    '#00e676',
    '#43a047',
    '#d32f2f',
    '#ff1744',
    '#ad1457',
    '#6a1b9a',
    '#1a237e',
    '#1de9b6',
    '#d84315'
  ];
  return colors[floor(random(0.9) * colors.length)];
}

function generateAvatar(text: string, backgroundColor: string, foregroundColor = 'white'): string {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" font-size="80" fill="${foregroundColor}" text-anchor="middle" dy=".3em">${text}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function seedUserData(count: number): Promise<void> {
    const baseUsername = faker.word.adjective();
    const generatedUsernames: Set<string> = new Set();
  try {
    for (let i = 0; i < count; i++) {
      let username: string;
      do {
        username = `${baseUsername}${i}`;
      } while (generatedUsernames.has(username));

      generatedUsernames.add(username);

      const color = avatarColor();
      const avatar = generateAvatar(username.charAt(0).toUpperCase(), color);

      const body = {
        username,
        email: faker.internet.email(),
        password: 'qwerty',
        avatarColor: color,
        avatarImage: avatar
      };
      console.log(`***ADDING USER TO DATABASE*** - ${i + 1} of ${count} - ${username}`);
      await axios.post(`${process.env.API_URL}/signup`, body);
    }
  } catch (error: any) {
    console.log(error?.response?.data);
  }
}

seedUserData(10);

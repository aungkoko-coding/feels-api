import { BadRequestException, ForbiddenException } from '@nestjs/common';
import axios from 'axios';
import { YoutubeLink } from '../dto/create-message.dto';
import { CryptoService } from 'src/crypto/crypto.service';
import { YoutubeLinkType } from '../definitions';

const youtubeRegex =
  /^https:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}(?:\?si=[a-zA-Z0-9_-]+)?$/;

const convertDuration = (duration: string) => {
  // Parse the duration string
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = duration.match(regex);

  // Extract hours, minutes, and seconds
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  // Return the result as an object
  return {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
};

export const getYoutubeData = async (
  ytLink: YoutubeLinkType,
  cryptoService: CryptoService,
) => {
  const url = ytLink.url;
  if (youtubeRegex.test(url)) {
    const videoId = url.slice(17, url.indexOf('?'));
    // console.log(videoId);
    const ytData = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${process.env.YOUTUBE_API_KEY}`,
    );
    const metadata = ytData.data.items[0];
    if (!metadata) {
      throw new BadRequestException(
        'Please mark sure your url is still valid!',
      );
    }

    const { hours, minutes, seconds } = convertDuration(
      metadata.contentDetails.duration,
    );
    ytLink.title = metadata.snippet.title;
    ytLink.thumbnailUrl = metadata.snippet.thumbnails.medium.url;
    ytLink.duration = `${hours ? hours + ':' : ''}${
      minutes ? minutes + ':' : '00:'
    }${seconds ? seconds : '00'}`;

    if (!ytLink.public) {
      ytLink.title = cryptoService.encrypt(ytLink.title);
      ytLink.thumbnailUrl = cryptoService.encrypt(ytLink.thumbnailUrl);
      ytLink.url = cryptoService.encrypt(ytLink.url);
    }
  } else {
    throw new ForbiddenException(
      'Please provide youtube video url in the correct format!',
    );
  }
};

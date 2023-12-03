import { ForbiddenException } from '@nestjs/common';
import axios from 'axios';
import { YoutubeLink } from '../dto/create-message.dto';
import { CryptoService } from 'src/crypto/crypto.service';

const youtubeRegex =
  /^https:\/\/youtu\.be\/[a-zA-Z0-9_-]{11}(?:\?si=[a-zA-Z0-9_-]+)?$/;

export const getYoutubeData = async (
  ytLink: YoutubeLink,
  cryptoService: CryptoService,
) => {
  const url = ytLink.url;
  if (youtubeRegex.test(url)) {
    const videoId = url.slice(17, url.indexOf('?'));
    // console.log(videoId);
    const ytData = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${process.env.YOUTUBE_API_KEY}`,
    );

    ytLink.thumbnailUrl = ytData.data.items[0].snippet.thumbnails.medium.url;
    if (!ytLink.public) {
      ytLink.thumbnailUrl = cryptoService.encrypt(ytLink.thumbnailUrl);
      ytLink.url = cryptoService.encrypt(ytLink.url);
    }
  } else {
    throw new ForbiddenException(
      'Please provide youtube video url in the correct format!',
    );
  }
};

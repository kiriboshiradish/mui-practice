import './App.css'
import { useState } from 'react';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

function App() {
  interface AnimeItem {
    title: string;
    checked: boolean;
    episode: number;
    broadcastDay: string;
  }

  const [inputTitle, setInputTitle] = useState('');
  const [inputDay, setInputDay] = useState('月曜日');
  const [animeList, setAnimeList] = useState<AnimeItem[]>([]);

  // アニメを追加する関数
  const handleAddAnime = () => {
    if (inputTitle.trim() === '') return;
    setAnimeList([
      ...animeList, 
      { title: inputTitle, checked: false, episode: 1, broadcastDay: inputDay }
    ]);
    setInputTitle('');
  };

  // チェック状態を切り替える関数
  const handleToggleCheck = (index: number) => {
    const newlist = [...animeList];
    newlist[index].checked = !newlist[index].checked;
    setAnimeList(newlist);
  };

  // 話数を進める関数（ここが抜けていました）
  const handleIncrementEpisode = (index: number) => {
    const newlist = [...animeList];
    newlist[index].episode += 1;
    setAnimeList(newlist);
  };

  // アニメを削除する関数（ここが抜けていました）
  const handledeleteAnime = (indexToDelete: number) => {
    setAnimeList(animeList.filter((_, index) => index !== indexToDelete));
  };

  return (
    <Container maxWidth="sm" className="min-h-screen py-8">
      <h1 className="text-2xl font-bold text-center mb-4">アニメ視聴チェックリスト</h1>

      <div className="mt-4 flex gap-2 items-center">
        <TextField 
          label="アニメのタイトル" 
          variant="outlined" 
          size="small" 
          fullWidth 
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />

        <FormControl size="small" className="min-w-[100px]">
          <InputLabel>曜日</InputLabel>
          <Select
            value={inputDay}
            label="曜日"
            onChange={(e) => setInputDay(e.target.value)}
          >
            <MenuItem value="月曜日">月曜日</MenuItem>
            <MenuItem value="火曜日">火曜日</MenuItem>
            <MenuItem value="水曜日">水曜日</MenuItem>
            <MenuItem value="木曜日">木曜日</MenuItem>
            <MenuItem value="金曜日">金曜日</MenuItem>
            <MenuItem value="土曜日">土曜日</MenuItem>
            <MenuItem value="日曜日">日曜日</MenuItem>
            <MenuItem value="未定">未定</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleAddAnime}>
          追加
        </Button>
      </div>

      <List className="mt-4">
        {animeList.map((anime, index) => (
          <ListItem 
            key={index} 
            divider
            secondaryAction={
              <div className="flex items-center gap-2">
                <Chip 
                  label={`${anime.episode}話`} 
                  color="primary" 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleIncrementEpisode(index)}
                  title="クリックすると話数が進みます"
                />
                <IconButton edge="end" aria-label="delete" onClick={() => handledeleteAnime(index)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            }
          >
            <Checkbox 
              checked={anime.checked}
              onChange={() => handleToggleCheck(index)}
            />
            <ListItemText 
              primary={anime.title} 
              secondary={`更新: ${anime.broadcastDay}`} 
              className={anime.checked ? "line-through text-gray-400" : ""}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default App
import './App.css';
import { useState, useMemo } from 'react';

// MUI Components (合計20種類以上)
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SortIcon from '@mui/icons-material/Sort';

import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// アニメデータの型定義
interface AnimeItem {
  id: string;
  title: string;
  checked: boolean;
  episode: number;
  broadcastDay: string;
  createdAt: number;
}

// 曜日ソート順
const DAY_ORDER: Record<string, number> = {
  '月曜日': 1, '火曜日': 2, '水曜日': 3, '木曜日': 4,
  '金曜日': 5, '土曜日': 6, '日曜日': 7, '未定': 8
};

export default function App() {
  // --- ステート管理 ---
  const [inputTitle, setInputTitle] = useState('');
  const [inputDay, setInputDay] = useState('月曜日');
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'day' | 'title' | 'episode'>('created');
  const [darkMode, setDarkMode] = useState(false);

  // 通知用Snackbarステート
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // 初期サンプルデータ
  const [animeList, setAnimeList] = useState<AnimeItem[]>([
    { id: '1', title: '葬送のフリーレン', checked: false, episode: 12, broadcastDay: '金曜日', createdAt: 1 },
    { id: '2', title: '呪術廻戦', checked: true, episode: 24, broadcastDay: '木曜日', createdAt: 2 },
  ]);

  // テーマ切り替え (ダークモード / ライトモード)
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: darkMode ? '#90caf9' : '#1976d2',
          },
        },
      }),
    [darkMode]
  );

  // --- アクションハンドラー ---
  const showNotification = (message: string, severity: 'success' | 'info' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddAnime = () => {
    if (inputTitle.trim() === '') return;
    const newItem: AnimeItem = {
      id: Date.now().toString(),
      title: inputTitle.trim(),
      checked: false,
      episode: 1,
      broadcastDay: inputDay,
      createdAt: Date.now(),
    };
    setAnimeList([newItem, ...animeList]);
    setInputTitle('');
    showNotification(`「${newItem.title}」を追加しました！`);
  };

  const handleToggleCheck = (id: string) => {
    setAnimeList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleIncrementEpisode = (id: string) => {
    setAnimeList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextEp = item.episode + 1;
          showNotification(`「${item.title}」を ${nextEp}話 に更新しました`);
          return { ...item, episode: nextEp };
        }
        return item;
      })
    );
  };

  const handleDeleteAnime = (id: string, title: string) => {
    setAnimeList((prev) => prev.filter((item) => item.id !== id));
    showNotification(`「${title}」を削除しました`, 'info');
  };

  // --- フィルタリング & ソート計算 ---
  const filteredAndSortedList = useMemo(() => {
    return animeList
      // 1. タブフィルター
      .filter((item) => {
        if (tabValue === 'active') return !item.checked;
        if (tabValue === 'completed') return item.checked;
        return true;
      })
      // 2. 検索キーワードフィルター
      .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
      // 3. ソート処理
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title, 'ja');
        if (sortBy === 'day') return (DAY_ORDER[a.broadcastDay] || 99) - (DAY_ORDER[b.broadcastDay] || 99);
        if (sortBy === 'episode') return b.episode - a.episode;
        return b.createdAt - a.createdAt; // 新しい順
      });
  }, [animeList, tabValue, searchQuery, sortBy]);

  // カウント集計
  const activeCount = animeList.filter((item) => !item.checked).length;
  const completedCount = animeList.filter((item) => item.checked).length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" className="py-8 min-h-screen">
        {/* ヘッダー領域 */}
        <Paper elevation={3} className="p-6 mb-6 rounded-2xl">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h4" component="h1" className="font-bold">
              📺 アニメ視聴チェックリスト
            </Typography>
            <Tooltip title={darkMode ? 'ライトモードに変更' : 'ダークモードに変更'}>
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* 追加入力フォーム */}
          <Box className="flex flex-col sm:flex-row gap-3">
            <TextField
              label="アニメのタイトル"
              variant="outlined"
              size="small"
              fullWidth
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddAnime()}
            />
            <FormControl size="small" className="min-w-[120px]">
              <InputLabel>更新曜日</InputLabel>
              <Select
                value={inputDay}
                label="更新曜日"
                onChange={(e) => setInputDay(e.target.value)}
              >
                {['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日', '未定'].map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddAnime}
              className="whitespace-nowrap px-6"
            >
              追加
            </Button>
          </Box>
        </Paper>

        {/* コントロールパネル（検索・フィルター・ソート） */}
        <Card className="mb-6">
          <CardContent>
            <Box className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              {/* 検索バー */}
              <TextField
                size="small"
                placeholder="タイトルを検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-72"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              {/* ソート選択ドロップダウン */}
              <FormControl size="small" className="w-full md:w-48">
                <InputLabel className="flex items-center gap-1">
                  並び替え
                </InputLabel>
                <Select
                  value={sortBy}
                  label="並び替え"
                  onChange={(e) => setSortBy(e.target.value as any)}
                  startAdornment={<SortIcon className="mr-1 text-gray-500" />}
                >
                  <MenuItem value="created">追加日順（新しい順）</MenuItem>
                  <MenuItem value="day">更新曜日順</MenuItem>
                  <MenuItem value="title">タイトル五十音順</MenuItem>
                  <MenuItem value="episode">話数が多い順</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider className="my-2" />

            {/* ステータスタブ */}
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab
                value="all"
                label={
                  <Badge badgeContent={animeList.length} color="default" className="px-2">
                    すべて
                  </Badge>
                }
              />
              <Tab
                value="active"
                label={
                  <Badge badgeContent={activeCount} color="primary" className="px-2">
                    視聴中
                  </Badge>
                }
              />
              <Tab
                value="completed"
                label={
                  <Badge badgeContent={completedCount} color="success" className="px-2">
                    視聴完了
                  </Badge>
                }
              />
            </Tabs>
          </CardContent>
        </Card>

        {/* アニメ一覧リスト */}
        <Paper elevation={2}>
          {filteredAndSortedList.length === 0 ? (
            <Box className="p-8 text-center text-gray-500">
              <Typography>該当するアニメが見つかりません</Typography>
            </Box>
          ) : (
            <List divider>
              {filteredAndSortedList.map((anime) => (
                <ListItem
                  key={anime.id}
                  secondaryAction={
                    <Box className="flex items-center gap-2">
                      <Tooltip title="クリックして話数を追加">
                        <Chip
                          label={`${anime.episode}話`}
                          color={anime.checked ? 'default' : 'primary'}
                          variant="outlined"
                          size="small"
                          onClick={() => handleIncrementEpisode(anime.id)}
                          className="cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-800"
                        />
                      </Tooltip>
                      <Tooltip title="削除">
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleDeleteAnime(anime.id, anime.title)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <Checkbox
                    checked={anime.checked}
                    onChange={() => handleToggleCheck(anime.id)}
                  />
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        className={anime.checked ? 'line-through text-gray-400' : 'font-medium'}
                      >
                        {anime.title}
                      </Typography>
                    }
                    secondary={`更新: ${anime.broadcastDay}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>

        {/* 操作完了時のスナックバー（ポップアップ通知） */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
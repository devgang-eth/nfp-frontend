import {useCallback, useEffect, useState} from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid, InputAdornment,
  Link,
  Stack,
  Typography, useMediaQuery
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {DashboardLayout} from '../../../components/dashboard/dashboard-layout';
import {
  CompanyOverview
} from '../../../components/projects/projectInfo/company-overview';
import {useMounted} from '../../../hooks/use-mounted';
import {gtm} from '../../../lib/gtm';
import {useTheme} from "@mui/material/styles";
import {green, grey, red} from '@mui/material/colors';
import {
  CallMade,
  GitHub,
  Reddit,
  Share,
  Telegram,
  Twitter
} from "@mui/icons-material";
import {faDiscord} from "@fortawesome/free-brands-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {api} from "../../../api/apiClient";
import dynamic from "next/dynamic";
import {
  ContentShareDialog
} from "../../../components/dashboard/conent-share-dialog";
import StringHelper from "../../../utils/StringHelper";
import {apiConfig} from "../../../config";
import {Search as SearchIcon} from "../../../icons/search";

const Header = ({logoImg, title, description, tags}) => {
  const theme = useTheme();
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  if (mdUp) {
    return (
      <Stack direction={"row"} style={{background: "transparent", flex:1}} spacing={theme.spacing(4)}>
        <img
          width={100}
          height={100}
          src={logoImg}
          style={{marginTop: 4}}
        />
        <Stack>
          <Typography variant="h6" align={"left"} color={"white"}>
            {title}
          </Typography>
          <Typography
            sx={{mt: 1}}
            variant="body2"
            color={"white"}
          >
            {description}
          </Typography>
          <Grid container direction={"row"} spacing={theme.spacing(1)} sx={{marginTop: theme.spacing(2)}}>
            {tags?.map((e, idx) => {
              return (
                <Grid key={idx} item>
                <Chip
                key={idx}
                label={e}
                variant="outlined"
                sx={{color: "white", background: 'rgba(255, 255, 255, 0.1)'}}
              /></Grid>)
            })}
          </Grid>
          {/*</Stack>*/}
        </Stack>
      </Stack>)
  } else {
    return (
      <Stack direction={"column"} style={{background: "transparent", flex:1}} spacing={theme.spacing(4)}>
        <Stack direction={"row"} sx={{flex:1}} justifyContent={"center"}>
          <img
            width={100}
            height={100}
            src={logoImg}
            style={{marginTop: 4}}
          />
        </Stack>
        <Stack>
          <Typography variant="h6" align={"left"} color={"white"}>
            {title}
          </Typography>
          <Typography
            sx={{mt: 1}}
            variant="body2"
            color={"white"}
          >
            {description}
          </Typography>
          <Grid container direction={"row"} spacing={theme.spacing(1)} sx={{marginTop: theme.spacing(2)}}>
            {tags?.map((e, idx) => {
              return (
                <Grid key={idx} item>
                  <Chip
                    key={idx}
                    label={e}
                    variant="outlined"
                    sx={{color: "white", background: 'rgba(255, 255, 255, 0.1)'}}
                  /></Grid>)
            })}
          </Grid>
          {/*</Stack>*/}
        </Stack>
      </Stack>)
  }
}

const ContentShareButton = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenSearchDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseSearchDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Button variant="contained" startIcon={<Share />} sx={{borderRadius:4, color:"white"}}
              color="primary"
              onClick={handleOpenSearchDialog}>
        Share
      </Button>
      <ContentShareDialog
        onClose={handleCloseSearchDialog}
        open={openDialog}
      />
    </>
  );
};

const CompanySummary = ({links}) => {
  const theme = useTheme();

  const linkIconKeys = [
    "twitter", "reddit", "discord", "github", "telegram",
  ];

  const getLinkIcon = (keyName) => {
    switch (keyName) {
      case "twitter":
        return <Twitter/>
      case "reddit":
        return <Reddit/>
      case "discord":
        return <FontAwesomeIcon icon={faDiscord} />
      case "github":
        return <GitHub />
      case "telegram":
        return <Telegram />
    }
    return null;
  }

  const getLinkButton = ({keyName, href}) => {
    // if (!linkIconKeys.includes(keyName)) return null
    if (StringHelper.isEqualTrimAndIgnoreCase(keyName, 'WEBSITE')) return null;

    return (<Button
      variant="text" size={"small"} sx={{borderRadius:4, color:"white",
      '&:hover': {
        backgroundColor: 'rgba(255,255,255, 0.08)'
      },
      }}
      onClick={(e)=>{
        e.preventDefault();
        window.open(href, "_blank");
      }}
    >
      {keyName?.toUpperCase()}
    </Button>)
  };

  return (
    <Card
      sx={{background:'rgba(255, 255, 255, 0.1)',
        borderColor: '#54576a',
        borderWidth: 1,
        borderStyle: 'solid',
        mb: 2
      }}
    >
      <CardContent>
        <Stack
          justifyContent="flex-start"
          alignItems="flex-start"
          sx={{marginBottom:4}}
        >
          <Button
            startIcon={<CallMade />}
            sx={{borderRadius:4}}
            variant="contained"
            onClick={(e)=>{
              e.preventDefault();
              window.open(links.website, "_blank");
            }}
          >
            Visit website
          </Button>
        </Stack>
        <Stack
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1}
        >
          {Object.keys(links).map(key => {
            return getLinkButton({keyName: key, href: links[key]})
          })}
        </Stack>
      </CardContent>
      <Divider />
      <CardContent>
        <ContentShareButton />
      </CardContent>
    </Card>
  )
}

const CompanyDetails = () => {
  const isMounted = useMounted();
  const [projectInfo, setProjectInfo] = useState(null);
  const [series, setSeries] = useState([])
  const [lastPrice, setLastPrice] = useState("");
  const [dayChangeRateByPercentage, setDayChangeRateByPercentage] = useState(0);

  const Chart = dynamic(() => import("../../../components/projects/ProjectChart2"), {
    ssr: false
  });

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const getProjectInfo = useCallback(async () => {
    try {
      const response = await api.get(apiConfig.projectInfo);
      const dataMap = response.data;
      if (isMounted()) {
        const pageName = window.location.pathname.trim().split('/').slice(-1).pop().toUpperCase();
        const projectData = dataMap[pageName.toUpperCase()];
        // set up tag list
        const tagList = [];
        projectData.tags.split(",").forEach(tag => {
          tagList.push(tag);
        })
        projectData.tags = tagList;
        setProjectInfo(projectData);
        return projectData;
      }
      return null;
    } catch (err) {
      console.error(err);
    }
  }, [isMounted]);

  const getPriceHistory = async (symbol) => {
    const res = await api.get(`/price/history?symbol=${symbol.toUpperCase()}`)
    return res?.data.data.map(
      history => {
        let timestamp = Date.parse(history.createdAt)
        return [timestamp, history.price]
      }
    );
  }

  useEffect(() => {
    api.get(`/project`)
      .then(response => {
        const pageName = window.location.pathname.trim().split('/').slice(-1).pop().toUpperCase();
        const projMarketInfo = response.data?.filter(e => StringHelper.isEqualTrimAndIgnoreCase(e.symbol, pageName))[0];
        if (projMarketInfo) {
          setLastPrice(projMarketInfo.price);
          const {dayChangeRateByPercentage} = projMarketInfo;
          setDayChangeRateByPercentage(dayChangeRateByPercentage);
        }
      })
  }, [])

  useEffect(() => {
      (async() => {
        const proj = await getProjectInfo();
        if (!proj)
          return;
        const data = await getPriceHistory(proj.symbol);
        setSeries([{
          name: 'Price($)',
          data
        }]);
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);

  if (!projectInfo) {
    return null;
  }

  const getChangeRateByPercentageColor = (percent) => {
    return percent < 0 ? red[500] : green[500];
  };

  return (
    <>
      <Head>
        <title>
          {projectInfo.title}
        </title>
      </Head>

      <Box
        component="main"
        sx={{
          width: "100%",
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{mb: 4}}>
            <Stack direction={"row"} alignItems="center" justifyContent="flex-start">
              <Box>
                <NextLink
                  href="/projects"
                  passHref
                >
                  <Link
                    color="white"
                    sx={{
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <ArrowBackIcon
                      fontSize="large"
                      sx={{ mr: 1 }}
                    />
                  </Link>
                </NextLink>
              </Box>
              <Typography variant="h4"
                          style={{
                            background: "-webkit-linear-gradient(45deg, #e9e1fe 30%, #e3eafc 90%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                          }}
              >
                Project Information
              </Typography>
            </Stack>
          </Box>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              xs={12}
              lg={8}
            >
              <Card
                sx={{background:'rgba(255, 255, 255, 0.1)',
                  borderColor: '#54576a',
                  borderWidth: 1,
                  borderStyle: 'solid'
                }}
              >
                <CardHeader
                  disableTypography
                  title={(
                    <Header
                      logoImg={projectInfo.logo}
                      title={projectInfo.title}
                      description={projectInfo.shortDescription}
                      tags={projectInfo.tags}
                    />
                  )}
                />
                <Divider />
                <CardContent>
                  <Stack>
                    <Stack
                      sx={{marginLeft: 2}}
                      direction={"row"}
                      spacing={1}
                      justifyContent="flex-start"
                      alignItems="center">
                      <Avatar
                        src={projectInfo.logo}
                        sx={{
                          background: 'transparent',
                          width: 32,
                          height: 32,
                        }}
                        variant="rounded"
                      />
                      <Typography variant="h6" align={"left"} color={"white"}>
                        {projectInfo.symbol}
                      </Typography>
                    </Stack>
                    <Stack direction={"row"} spacing={1} sx={{marginLeft: 2, marginTop: 1}} alignItems="flex-start">
                      <Typography variant="body1" align={"left"} color={"white"}>
                        ${lastPrice}
                      </Typography>
                      <Typography variant="body2" align={"left"} sx={{color: getChangeRateByPercentageColor(dayChangeRateByPercentage)}}>
                        {dayChangeRateByPercentage}%
                      </Typography>
                    </Stack>
                    <Box component="span" sx={{ marginTop: 5, background: 'transparent' }}>
                      <Chart series={series} style={{paddingLeft: 8, paddingRight: 8}}/>
                    </Box>
                  </Stack>
                </CardContent>
                <CardContent sx={{marginTop:-5}}>
                  <CompanyOverview projectInfo={projectInfo} />
                </CardContent>
              </Card>
            </Grid>
            <Grid
              item
              xs={12}
              lg={4}
            >
              <CompanySummary links={projectInfo.links} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

CompanyDetails.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default CompanyDetails;

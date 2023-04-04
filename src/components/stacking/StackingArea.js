import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  OutlinedInput, Slider, TextField,
  Typography,
  makeStyles, Drawer
} from "@mui/material";
import CountUp from "react-countup";
import {StackingDelegateBtn} from "./StackingDelegateBtn";
import {useEffect, useState} from "react";
import {getBalance} from "../../slices/account";
import {useConnect, userSessionState} from "../../connect/auth";
import {useAtomValue} from "jotai/utils";
import {useStxAddresses} from "../../connect/hooks";
import {useSelector} from "../../store";
import {SeverityPill} from "../severity-pill";
import Image from 'next/image'
import {useTheme} from "@mui/material/styles";


export const StackingArea = (props) => {
  const {connected} = useSelector((state) => state.connect);
  const theme = useTheme();

  const [delegateAmount, setDelegateAmount] = useState();
  const [stxBalance, setStxBalance] = useState(0);
  const {handleOpenAuth} = useConnect();
  const userSession = useAtomValue(userSessionState);
  const {ownerStxAddress} = useStxAddresses(userSession);
  const [cycle, setCycle] = useState(3);

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setCycle(newValue);
    }
  };

  function calUntilBurnHeight() {
    let nextStartBlockHeight = props.stackingInfo.nextRewardStartBlockHeight

    return nextStartBlockHeight + (cycle * 2100)
  }

  useEffect(() => {
    console.log("connected: " + connected + " / ownerStxAddress: " + ownerStxAddress);
    if (connected & ownerStxAddress) {
      getBalance(ownerStxAddress, true)
        .then((response) => {
          setStxBalance(response.data.stxInfo.balance)
        })
    }
  }, [ownerStxAddress])

  return (
    <>
      <Card
        sx={{background:'rgba(255, 255, 255, 0.1)',
          borderColor: '#54576a',
          borderWidth: 1,
          borderStyle: 'solid',
          mb: 2
        }}
      >
        <CardHeader
          sx={{pb: 0, pt: 3}}
          title={(
            <Box sx={{display: "flex", justifyContent: "space-between"}}>
              <Typography variant="h6" color={"white"}>
                Delegate Stacks
              </Typography>
              <a href={"https://stacking.club/reward-address/12DQ3u4JdnGf6QZF9qAd7z9zUo7NnXpXFg"} rel="noreferrer" target={"_blank"}>
                <Image width={"20px"} height={"20px"} src={"/pancake.png"}/>
              </a>
            </Box>
          )}
        />
        <CardContent sx={{pt: "15px", paddingBottom: "0px"}}>
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant={"overline"} color={"white"}>My Balance</Typography>
            <Typography variant={"overline"} color={"white"}>
              {<CountUp duration={1.2} end={stxBalance}/>} STX
            </Typography>
          </Box>
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant={"overline"} color={"white"}>Upcoming Cycle</Typography>
            <Typography variant={"overline"} color={"white"}>
              #{props.stackingInfo.nextCycle}
            </Typography>
          </Box>
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant={"overline"} color={"white"}>Delegation Deadline IN</Typography>
            <Typography variant={"overline"} color={"white"}>
              {props.stackingInfo.deadLine > 0 ? `${props.stackingInfo.deadLine} blocks` :
                props.stackingInfo.nextRewardCycleIn === -9999 ? '-'
                  : <SeverityPill sx={{fontSize: "10px"}} color={"error"}>{"CLOSED"}</SeverityPill>}
            </Typography>
          </Box>
          <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Typography variant={"overline"} color={"white"}>Reward Payout in</Typography>
            <Typography variant={"overline"} color={"white"}>
              XBTC
            </Typography>
          </Box>
          <Box sx={{display: "flex", justifyContent: "space-between", mb: 4}}>
            <Typography
              color="white"
              variant="overline"
            >
              Rewards fee
            </Typography>
            <Typography
              color="white"
              variant="overline"
            >
              7%
            </Typography>
          </Box>
          <Box sx={{mt: 2, mb: 2}}>
            <OutlinedInput
              fullWidth
              onChange={(e) => {
                setDelegateAmount(e.target.value)
              }}
              type={"number"}
              placeholder={"MIN 100 STX"}
              value={delegateAmount}
              sx={{fontSize: "0.9rem",
                color: 'white',
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2,
                }
              }}
              endAdornment={
                <InputAdornment position="end">
                  <Button onClick={() => {
                    let nBalance = parseInt(stxBalance)
                    setDelegateAmount(nBalance - 1 > 0 ? nBalance - 1 : 0)
                  }}>
                    MAX
                  </Button>
                </InputAdornment>
              }
            />
          </Box>
          <Slider
            value={cycle}
            min={1}
            step={1}
            max={12}
            onChange={handleChange}
            valueLabelDisplay="auto"
            aria-labelledby="non-linear-slider"
          />
          <Typography mb={2} sx={{textAlign: "right"}} id="non-linear-slider" variant={"subtitle2"}
                      color={"white"}>
            Cycle to participate: {cycle} cycles
          </Typography>
          {connected ?
            <StackingDelegateBtn isStacked={props.isStacked} stackingInfo={props.stackingInfo} delegateAmount={delegateAmount}
                                 untilBurnHeight={calUntilBurnHeight()}/>
            :
            <Button sx={{width: "100%", borderRadius: '5px'}} variant={"contained"} onClick={() => handleOpenAuth()}>Connect
              wallet</Button>}
          <Typography mt={2} sx={{textAlign: "center"}} id="non-linear-slider" variant={"subtitle2"}
                      color="neutral.400">
            FAQ: <a style={{textDecoration: "none", color: "blue"}}
                    href={"https://nfpstudio.medium.com/exploring-nfp-studio-stacking-service-1c98a72092df"}
                    rel="noreferrer"
                    target={"_blank"}>English</a> | <a style={{textDecoration: "none", color: "blue"}}
                                                       href={"https://nfpstudio.medium.com/nfp-%EC%8A%A4%ED%8A%9C%EB%94%94%EC%98%A4-%EC%8A%A4%ED%83%9D%ED%82%B9-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-5697a11ff6e7"}
                                                       rel="noreferrer"
                                                       target={"_blank"}>Korean</a>
          </Typography>
          <Typography mt={1} sx={{textAlign: "center", fontSize: "11px"}} id="non-linear-slider"
                      color="neutral.400">
            <a href={"https://stackskorea.co/"} style={{textDecoration: "none", color: "#9aa3ae"}}
               rel="noreferrer"
               target={"_blank"}>Trusted
              By Stacks Korea.</a>
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}

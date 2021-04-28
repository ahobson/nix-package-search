import { useEffect, useState, MouseEvent, MouseEventHandler } from 'react'

import Alert from '@material-ui/lab/Alert'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import LinearProgress from '@material-ui/core/LinearProgress'
import FormControl from '@material-ui/core/FormControl'

import { SearchCardContent } from './SearchCardContent'

import { Metadata, getLastModifiedAt, setMetadata } from './../config/DBConfig'
import {
  isNixProgressMessage,
  isNixDownloadFinishedMessage,
} from './../config/messages'
import { useNixWorker } from './../hooks/useNixWorker'
import { getRemoteMetadata } from './../util/dbLoader'

const WARN_DAYS_AGO = 7 * 86400 * 1000

enum PackageStatus {
  Missing,
  Stale,
  Recent,
  Current,
}

enum DownloadStatus {
  Initial,
  Requested,
  Started,
  Finished,
}

function ButtonControl({ onClick }: { onClick: MouseEventHandler }) {
  return (
    <FormControl>
      <Button variant="contained" color="primary" onClick={onClick}>
        Download
      </Button>
    </FormControl>
  )
}

export function Search() {
  const [localLastModifiedAt, setLocalLastModifiedAt] = useState(0)
  const [remoteLastModifiedAt, setRemoteLastModifiedAt] = useState(0)
  const [remotePackageSize, setRemotePackageSize] = useState(0)
  const [downloadStatus, setDownloadStatus] = useState(DownloadStatus.Initial)
  const [packageStatus, setPackageStatus] = useState(PackageStatus.Missing)
  const [cursor, setCursor] = useState(0)
  const [progress, setProgress] = useState(100)
  const nixWorker = useNixWorker()

  const messageHandler = (message: MessageEvent) => {
    if (isNixProgressMessage(message.data)) {
      setCursor(message.data.cursor)
    } else if (isNixDownloadFinishedMessage(message.data)) {
      setDownloadStatus(DownloadStatus.Finished)
    }
  }

  useEffect(() => {
    getRemoteMetadata().then((remoteMetadata) => {
      if (remoteMetadata) {
        setRemoteLastModifiedAt(remoteMetadata.lastModifiedAt)
        setRemotePackageSize(remoteMetadata.packageSize)
      }
    })
    getLastModifiedAt().then((lastModifiedAt) => {
      if (lastModifiedAt) {
        setLocalLastModifiedAt(lastModifiedAt)
      } else {
        setPackageStatus(PackageStatus.Missing)
      }
    })
    if (localLastModifiedAt > 0 && remoteLastModifiedAt > 0) {
      if (remoteLastModifiedAt - localLastModifiedAt > WARN_DAYS_AGO) {
        setPackageStatus(PackageStatus.Stale)
      } else if (remoteLastModifiedAt === localLastModifiedAt) {
        setPackageStatus(PackageStatus.Current)
      } else {
        setPackageStatus(PackageStatus.Recent)
      }
    }
  }, [localLastModifiedAt, remoteLastModifiedAt])

  useEffect(() => {
    nixWorker.addEventListener('message', messageHandler)
    return function cleanup() {
      nixWorker.removeEventListener('message', messageHandler)
    }
  }, [nixWorker])

  useEffect(() => {
    if (downloadStatus === DownloadStatus.Requested) {
      setCursor(0)
      setProgress(0)
      setDownloadStatus(DownloadStatus.Started)
      nixWorker.postMessage({ op: 'parseAndLoad' })
    }
  }, [downloadStatus, nixWorker])

  useEffect(() => {
    if (downloadStatus === DownloadStatus.Finished) {
      setProgress(100)
      setMetadata(new Metadata(remoteLastModifiedAt, remotePackageSize))
    }
  }, [downloadStatus, remoteLastModifiedAt, remotePackageSize])

  useEffect(() => {
    if (downloadStatus === DownloadStatus.Started) {
      const progress = (cursor / remotePackageSize) * 100
      setProgress(progress)
    }
  }, [downloadStatus, cursor, remotePackageSize])

  function initiateDownload(e: MouseEvent) {
    e.preventDefault()
    setDownloadStatus(DownloadStatus.Requested)
  }

  if (
    packageStatus === PackageStatus.Missing &&
    downloadStatus === DownloadStatus.Initial
  ) {
    return (
      <Card>
        <CardContent>
          <Alert severity="warning">
            This local search downloads a ~30MB file that is stored and searched
            on your machine
          </Alert>
          <ButtonControl onClick={initiateDownload} />
        </CardContent>
      </Card>
    )
  }
  const hideDownload =
    packageStatus === PackageStatus.Current ||
    downloadStatus !== DownloadStatus.Initial
  const hideProgress = downloadStatus !== DownloadStatus.Started
  const hideSearch = downloadStatus === DownloadStatus.Started

  return (
    <Card>
      <CardContent hidden={hideDownload}>
        <Alert severity="warning">
          Your local package database is out of date.
        </Alert>
        <ButtonControl onClick={initiateDownload} />
      </CardContent>
      <CardContent hidden={hideProgress}>
        <Alert severity="info">Downloading and indexing package data</Alert>
        <LinearProgress variant="determinate" value={progress} />
      </CardContent>
      <SearchCardContent hidden={hideSearch} />
    </Card>
  )
}

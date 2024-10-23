import packegeJson from '../../package.json'

export const getVersion = async () => {
  console.log("any v" + packegeJson.version)
}


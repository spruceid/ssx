import { Card, CardContent, Typography } from "@material-ui/core";

function AccountInfo({ address }: { address: string }) {
  return (
    <div>
      <Card style={{ backgroundColor: "rgba(39, 39, 39, 0.7)", color: "white", width: "fit-content" }}>
        <CardContent>
          <Typography style={{ fontWeight: 'bold' }}>WALLET ADDRESS</Typography>
          <Typography>{address}</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountInfo;
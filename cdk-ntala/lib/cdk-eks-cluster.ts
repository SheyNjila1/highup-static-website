import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';

export class MyEksStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'MyVpc', { isDefault: true });

    const eksCluster = new eks.Cluster(this, 'MyEksCluster', {
      vpc: vpc,
      defaultCapacity: 0,
    });

    const nodeGroupName = 'MyNodeGroup';
    const instanceType = 't3.medium';
    const minSize = 1;
    const maxSize = 2;

    const nodeGroup = eksCluster.addNodegroupCapacity(nodeGroupName, {
      instanceType: new ec2.InstanceType(instanceType),
      minSize: minSize,
      maxSize: maxSize,
    });

    new cdk.CfnOutput(this, 'ClusterName', {
      value: eksCluster.clusterName,
    });

    new cdk.CfnOutput(this, 'NodeGroupName', {
      value: nodeGroupName,
    });

    new cdk.CfnOutput(this, 'ClusterEndpoint', {
      value: eksCluster.clusterEndpoint,
    });
  }
}

const app = new cdk.App();
new MyEksStack(app, 'MyEksStack');
